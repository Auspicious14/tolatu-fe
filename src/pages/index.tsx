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
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!text.trim()) {
      setError("Please enter some text to convert to audio.");
      setLoading(false);
      return;
    }

    try {
      const apiUrl = "https://text.pollinations.ai/openai";
      const payload = {
        model: "openai-audio",
        "modalities": ["text", "audio"],
        "audio": { "voice": "alloy", "format": "pcm16" },
        "messages": [
          {
            "role": "developer",
            "content": "You are a versatile AI"
         },
         {
            "role": "user",
            "content": text
         },  
        ],
      "private": true
      };

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const responseData = await res.json();
      
  
      if (!responseData.choices?.[0]?.message?.audio?.data) {
        throw new Error("No audio data returned from the API.");
      }

      const audioBase64 = responseData.choices[0].message.audio.data;
      const audioUrl = `data:audio/mp3;base64,${audioBase64}`;
      setAudioSrc(audioUrl);
    } catch (error: any) {
      console.error("Error generating audio:", error);
      setError(error.message || "Failed to generate audio. Please try again.");
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
          
           {error && <p className="text-red-500" >{error}</p>}
          
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
