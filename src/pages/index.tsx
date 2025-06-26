import React, { useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
  setLoading(true);
  try {
    // URL-encode the text input
    const encodedText = encodeURIComponent(text);
    
    // Create query string with parameters
    const queryParams = new URLSearchParams({
      model: "openai-audio",
      voice: "alloy"
    }).toString();
    
    // Construct the API URL
    const apiUrl = `https://text.pollinations.ai/${encodedText}?${queryParams}`;
    
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Accept": "audio/mpeg"
      }
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    setAudioSrc(url);
  } catch (error) {
    console.error("Error generating audio:", error);
    // Optionally set an error state
    // setError("Failed to generate audio");
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} min-h-screen font-[family-name:var(--font-geist-sans)]`}
    >
      <div className="flex flex-col items-center p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
          <h1 className="text-4xl font-semibold mb-6 text-center text-gray-100">
            Text to Audio
          </h1>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            rows={4}
            className="w-full p-4 mb-4 text-gray-100 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full p-4 mb-4 font-semibold text-gray-100 bg-pink-500 rounded-lg transition transform hover:bg-pink-600 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Convert to Audio"}
          </button>

          {audioSrc && (
            <div className="flex flex-col items-center">
              <audio src={audioSrc} controls className="w-full mb-4" />
              <a
                href={audioSrc}
                download="generated.wav"
                className="font-semibold text-pink-500 transition hover:text-pink-400"
              >
                Download Audio
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TextToSpeech;
