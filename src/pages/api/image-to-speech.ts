import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenAI } from "@google/genai";

const KOKORO_BASE_URL = process.env.KOKORO_API_URL || "";
const GEMINI_API_KEY  = process.env.GEMINI_API_KEY  || "";

const MAX_FILE_SIZE_MB = 10;

export const config = {
  api: { bodyParser: { sizeLimit: "15mb" } },
};

// ── Helpers ────────────────────────────────────────────────────────────────

function stripDataUrl(dataUrl: string): { base64: string; mimeType: string } {
  if (dataUrl.includes(",")) {
    const [meta, base64] = dataUrl.split(",");
    return { base64, mimeType: meta.replace("data:", "").replace(";base64", "") };
  }
  return { base64: dataUrl, mimeType: "application/octet-stream" };
}

function detectFileType(mimeType: string): "image" | "pdf" | "text" | "unknown" {
  if (mimeType.startsWith("image/"))  return "image";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType === "text/plain")      return "text";
  return "unknown";
}

function langToVoice(lang: string): string {
  const map: Record<string, string> = {
    en: "af_heart", fr: "af_heart", yo: "af_heart",
    ha: "af_heart", ig: "af_heart", pcm: "af_heart",
  };
  return map[lang] ?? "af_heart";
}

const JSON_PROMPT = `Return a JSON object with exactly two fields:
- "text": the full extracted text, preserving paragraph breaks with \\n\\n
- "lang": detected language code (en, fr, yo, ha, ig, pcm for Nigerian Pidgin)
If no readable text exists return { "text": "", "lang": "en" }.
Return ONLY the raw JSON object — no markdown fences, no explanation.`;

function parseGeminiJson(raw: string): { text: string; lang: string } {
  try {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { text: raw.trim(), lang: "en" };
  }
}

// ── Gemini extractors (SDK) ────────────────────────────────────────────────

function getClient() {
  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

async function extractFromImage(base64: string, mimeType: string) {
  const ai = getClient();
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: base64, mimeType } },
          { text: `Extract ALL readable text from this image exactly as written.\n${JSON_PROMPT}` },
        ],
      },
    ],
    config: { temperature: 0.1, maxOutputTokens: 4096 },
  });
  return parseGeminiJson(result.text ?? "");
}

async function extractFromPdf(base64: string) {
  const ai = getClient();
  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: base64, mimeType: "application/pdf" } },
          { text: `Extract ALL readable text from this PDF document (maximum 10 pages).\n${JSON_PROMPT}` },
        ],
      },
    ],
    config: { temperature: 0.1, maxOutputTokens: 8192 },
  });
  return parseGeminiJson(result.text ?? "");
}

function extractFromText(base64: string) {
  return { text: Buffer.from(base64, "base64").toString("utf-8").trim(), lang: "en" };
}

// ── Kokoro TTS ─────────────────────────────────────────────────────────────

async function synthesise(text: string, voice: string): Promise<Buffer> {
  const res = await fetch(`${KOKORO_BASE_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, speed: 1.0, lang_code: "a" }),
  });
  if (!res.ok) throw new Error(`Kokoro TTS error ${res.status}: ${await res.text()}`);
  const { audio } = await res.json() as { audio: string };
  return Buffer.from(audio, "base64");
}

// ── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!KOKORO_BASE_URL) return res.status(500).json({ success: false, message: "KOKORO_API_URL not configured" });
  if (!GEMINI_API_KEY)  return res.status(500).json({ success: false, message: "GEMINI_API_KEY not configured" });

  const raw = (req.body?.file ?? req.body?.image) as string | undefined;
  if (!raw || typeof raw !== "string") {
    return res.status(400).json({ success: false, message: "file (base64 data URL) is required" });
  }

  const { base64, mimeType } = stripDataUrl(raw);
  const fileType = detectFileType(mimeType);

  if (fileType === "unknown") {
    return res.status(415).json({
      success: false,
      message: "Unsupported file type. Upload an image, PDF, or .txt file.",
    });
  }

  const fileSizeMB = Buffer.byteLength(base64, "base64") / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return res.status(413).json({
      success: false,
      message: `File too large. Maximum is ${MAX_FILE_SIZE_MB}MB.`,
    });
  }

  try {
    const extracted =
      fileType === "image" ? await extractFromImage(base64, mimeType) :
      fileType === "pdf"   ? await extractFromPdf(base64) :
                             extractFromText(base64);

    if (!extracted.text.trim()) {
      return res.status(422).json({
        success: false,
        message: "No readable text found in the uploaded file.",
      });
    }

    const audioBuffer = await synthesise(extracted.text, langToVoice(extracted.lang));

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="tolatu.wav"');
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[file-to-speech]", message);
    return res.status(500).json({ success: false, message });
  }
}