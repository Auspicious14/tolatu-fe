import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const features = [
  {
    icon: "🔊",
    title: "Natural Voices",
    desc: "Choose from a variety of realistic voices, including Nigerian accents.",
  },
  {
    icon: "⚡",
    title: "Fast Conversion",
    desc: "Instantly convert your text to high-quality audio in seconds.",
  },
  {
    icon: "🎧",
    title: "Download & Listen",
    desc: "Play audio directly or download it for offline use.",
  },
  {
    icon: "🌐",
    title: "Accessible Anywhere",
    desc: "Works on any device, anytime, anywhere.",
  },
];

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
        const { data: response } = await axios.get(
          `${apiUrl}/get-available-voices`
        );
        if (!response.data) {
          toast.error("No voices available");
        }
        const voiceOptions = response.data;
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
          headers: { Accept: "audio/mpeg" },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center py-16 px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6 text-pink-500 drop-shadow-lg"
        >
          Tolatu: Effortless Text to Speech
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto"
        >
          Instantly convert your text to natural-sounding audio with support for
          multiple voices and languages. Perfect for accessibility,
          productivity, and fun!
        </motion.p>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
            >
              <span className="text-4xl mb-2">{f.icon}</span>
              <h3 className="text-xl font-semibold text-pink-400 mb-1">
                {f.title}
              </h3>
              <p className="text-gray-300 text-base">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TTS Section */}
      <section className="flex flex-col items-center justify-center py-10 px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
            Try It Out
          </h2>
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
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 bg-gray-900">
        <span>
          Made by{" "}
          <span className="text-pink-400 font-semibold">Auspicious</span> &copy;{" "}
          {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
};

export default TextToSpeech;
