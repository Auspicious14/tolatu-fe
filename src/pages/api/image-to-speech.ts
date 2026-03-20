import type { NextApiRequest, NextApiResponse } from "next";

const KOKORO_BASE_URL = process.env.KOKORO_API_URL || "";
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY  || "";

// Increase Vercel function timeout for image processing
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

async function extractTextFromImage(base64Image: string): Promise<{ text: string; voice: string }> {
  // Strip data URL prefix if present — e.g. "data:image/png;base64,..."
  const base64Data = base64Image.includes(",") ? base64Image.split(",")[1] : base64Image;
  const mimeType   = base64Image.includes("data:") ? base64Image.split(";")[0].replace("data:", "") : "image/jpeg";

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: { mime_type: mimeType, data: base64Data },
          },
          {
            text: `Extract ALL readable text from this image exactly as written. 
Return a JSON object with two fields:
- "text": the full extracted text, preserving line breaks with \\n
- "lang": the detected language code (e.g. "en", "fr", "yo", "ha", "ig", "pcm" for Nigerian Pidgin)

If there is no readable text, return { "text": "", "lang": "en" }.
Return ONLY the raw JSON object — no markdown, no explanation.`,
          },
        ],
      },
    ],
    generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
  };

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!geminiRes.ok) {
    throw new Error(`Gemini API error: ${geminiRes.status}`);
  }

  const geminiData = await geminiRes.json();
  const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  let extracted: { text: string; lang: string } = { text: rawText.trim(), lang: "en" };

  try {
    // Gemini sometimes wraps in ```json ... ```
    const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
    extracted = JSON.parse(cleaned);
  } catch {
    // If JSON parse fails, use the raw text as-is
    extracted.text = rawText.trim();
  }

  if (!extracted.text.trim()) {
    throw new Error("No readable text found in image");
  }

  // Map detected lang to best Kokoro voice
  const langToVoice: Record<string, string> = {
    en:  "af_heart",
    fr:  "af_heart",   // Kokoro doesn't have French — fallback
    yo:  "af_heart",   // Yoruba — Kokoro fallback (use /tts/yoruba if needed)
    ha:  "af_heart",
    ig:  "af_heart",
    pcm: "af_heart",   // Pidgin — closest to English
  };

  const voice = langToVoice[extracted.lang] ?? "af_heart";
  return { text: extracted.text, voice };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { image } = req.body;

  if (!image || typeof image !== "string") {
    return res.status(400).json({ success: false, message: "image (base64) is required" });
  }

  if (!KOKORO_BASE_URL) {
    return res.status(500).json({ success: false, message: "KOKORO_API_URL is not configured" });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured" });
  }

  try {
    // Step 1: Extract text from image using Gemini vision
    const { text, voice } = await extractTextFromImage(image);

    // Step 2: Send extracted text to Kokoro TTS
    const kokoroRes = await fetch(`${KOKORO_BASE_URL}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, voice, speed: 1.0, lang_code: "a" }),
    });

    if (!kokoroRes.ok) {
      const errBody = await kokoroRes.text();
      console.error("[Image TTS] Kokoro error:", kokoroRes.status, errBody);
      return res.status(502).json({
        success: false,
        message: `Kokoro TTS service error: ${kokoroRes.status}`,
      });
    }

    const { audio } = await kokoroRes.json() as { audio: string };

    const audioBuffer = Buffer.from(audio, "base64");

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="image-speech.wav"');
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Image TTS] Error:", message);
    return res.status(500).json({ success: false, message });
  }
}