import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/*function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!text.trim()) {
      setError("Please enter some text to convert to audio.");
      setLoading(false);
      return;
    }

    try {
      const apiUrlFull = `${apiUrl}/text-to-speech`;
      const res = await fetch(`${apiUrlFull}?text=${encodeURIComponent(text)}`, {
             method: "GET",
             headers: {
             "Accept": "audio/mpeg"
             }
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP error! status: ${res.status}, details: ${errorText}`);
      }

      const blob = await res.blob();
      const audioUrl = URL.createObjectURL(blob);
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
                download="generated.mp3"
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

export default TextToSpeech; */

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<{ label: string; value: string }[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch(`${apiUrl}/get-available-voices`);
        const data = await res.json();
        const voiceOptions = data.data;

        const sortedVoices = voiceOptions.sort((a: any, b: any) => {
          if (a.country === "Nigeria" && b.country !== "Nigeria") return -1;
          if (a.country !== "Nigeria" && b.country === "Nigeria") return 1;
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });

        setVoices(
          sortedVoices.map((v: any) => ({
            label: `${v.name} (${v.gender}, ${v.country})`,
            value: v.voice,
          }))
        );
        if (voiceOptions.length > 0) {
          setSelectedVoice({
            label: `${sortedVoices[0].name} (${sortedVoices[0].gender}, ${sortedVoices[0].country})`,
            value: sortedVoices[0].voice,
          });
        }
      } catch (err) {
        console.error("Failed to load voices", err);
        setError("Could not load available voices.");
      }
    };
    fetchVoices();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    if (!text.trim()) {
      setError("Please enter some text to convert to audio.");
      setLoading(false);
      return;
    }

    try {
      const query = new URLSearchParams({
        text: text,
        voice: selectedVoice?.value || "",
      });
      const res = await fetch(
        `${apiUrl}/text-to-speech-with-edge?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Accept: "audio/mpeg",
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
          `HTTP error! status: ${res.status}, details: ${errorText}`
        );
      }

      const blob = await res.blob();

      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
    } catch (error: any) {
      console.error("Error generating audio:", error);
      setError(error.message || "Failed to generate audio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6 flex flex-col items-center">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-semibold mb-6 text-center text-gray-100">
          Text to Audio
        </h1>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full p-4 mb-4 text-gray-100 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Enter text to convert to speech..."
        />

        {voices?.length > 0 && (
          <select
            value={selectedVoice?.value}
            onChange={(e) => {
              const voice = voices.find((v) => v.value === e.target.value);
              if (voice) {
                setSelectedVoice(voice);
              }
            }}
            className="w-full p-2 mb-4 border rounded bg-gray-900 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-150"
          >
            {voices.map((voice) => (
              <option key={voice.value} value={voice.value}>
                {voice.label}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full p-4 mb-4 font-semibold text-gray-100 bg-pink-500 rounded-lg transition transform hover:bg-pink-600 active:scale-95 disabled:opacity-50"
        >
          {loading ? "Generating…" : "Convert to Audio"}
        </button>
        {text.length > 200 && loading && (
          <div style={{ color: "#f59e42", marginTop: 8 }}>
            ⚠️ Your text is quite long! Generating audio might take a little
            longer depending on your connection and server load. Please be
            patient 😊
          </div>
        )}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {audioSrc && (
          <div className="flex flex-col items-center">
            <audio src={audioSrc} controls className="w-full mb-4" />
            <a
              href={audioSrc}
              download="generated.mp3"
              className="font-semibold text-pink-500 transition hover:text-pink-400"
            >
              Download Audio
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToSpeech;
