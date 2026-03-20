export type Voice = {
  value: string;
  label: string;
  lang: string;
};

const API_BASE = "/api";

export async function fetchVoices(): Promise<Voice[]> {
  const res = await fetch(`${API_BASE}/voices`);
  if (!res.ok) throw new Error("Failed to fetch voices");
  const { data } = await res.json();
  return data as Voice[];
}

export async function textToSpeech(
  text: string,
  voice: string,
  speed: number = 1.0
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice, speed }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "TTS request failed" }));
    throw new Error(err.message ?? "TTS request failed");
  }

  return res.blob();
}

export async function imageToSpeech(
  base64File: string,
  _file?: File | null
): Promise<Blob> {
  const res = await fetch(`${API_BASE}/image-to-speech`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file: base64File }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "File TTS request failed" }));
    throw new Error(err.message ?? "File TTS request failed");
  }

  return res.blob();
}