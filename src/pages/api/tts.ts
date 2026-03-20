import type { NextApiRequest, NextApiResponse } from "next";

const KOKORO_BASE_URL = process.env.KOKORO_API_URL || "";

// Voice map — Kokoro voice IDs exposed to the frontend
// Full list: https://huggingface.co/hexgrad/Kokoro-82M
export const KOKORO_VOICES = [
  // American English
  { value: "af_heart",   label: "Heart (US Female)",    lang: "en" },
  { value: "af_bella",   label: "Bella (US Female)",    lang: "en" },
  { value: "af_sarah",   label: "Sarah (US Female)",    lang: "en" },
  { value: "af_nicole",  label: "Nicole (US Female)",   lang: "en" },
  { value: "am_adam",    label: "Adam (US Male)",       lang: "en" },
  { value: "am_michael", label: "Michael (US Male)",    lang: "en" },
  // British English
  { value: "bf_emma",    label: "Emma (UK Female)",     lang: "en" },
  { value: "bf_isabella",label: "Isabella (UK Female)", lang: "en" },
  { value: "bm_george",  label: "George (UK Male)",     lang: "en" },
  { value: "bm_lewis",   label: "Lewis (UK Male)",      lang: "en" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { text, voice = "af_heart", speed = 1.0 } = req.body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return res.status(400).json({ success: false, message: "text is required" });
  }

  if (!KOKORO_BASE_URL) {
    return res.status(500).json({ success: false, message: "KOKORO_API_URL is not configured" });
  }

  try {
    const kokoroRes = await fetch(`${KOKORO_BASE_URL}/tts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: text.trim(),
        voice,
        speed: Number(speed),
        lang_code: "a",
      }),
    });

    if (!kokoroRes.ok) {
      const errBody = await kokoroRes.text();
      console.error("[TTS] Kokoro error:", kokoroRes.status, errBody);
      return res.status(502).json({
        success: false,
        message: `Kokoro TTS service error: ${kokoroRes.status}`,
      });
    }

    const { audio } = await kokoroRes.json() as { audio: string; format: string; sample_rate: number };

    // Decode base64 WAV and stream back as audio
    const audioBuffer = Buffer.from(audio, "base64");

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader("Content-Disposition", 'inline; filename="tts.wav"');
    res.setHeader("Content-Length", audioBuffer.length);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).send(audioBuffer);

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[TTS] Unexpected error:", message);
    return res.status(500).json({ success: false, message });
  }
}