import React, { useState, useEffect, ChangeEvent } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import Image from "next/image";
import { base } from "framer-motion/client";

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
  const [base64Image, setBase64Image] = useState<string>("");
  const [imageAudioSrc, setImageAudioSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
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
        setVoices(
          voiceOptions.map((v: any) => ({
            label: `${v.name} (${v.gender}, ${v.country})`,
            value: v.voice,
          }))
        );
        if (voiceOptions.length > 0) {
          setSelectedVoice({
            label: `${voiceOptions[0].name} (${voiceOptions[0].gender}, ${voiceOptions[0].country})`,
            value: voiceOptions[0].voice,
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
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64Image = await convertImageToBase64(e.target.files[0]);
      setImageFile(e.target.files[0]);
      if (!base64Image) {
        return;
      }
      setBase64Image(base64Image);
    }
  };

  const convertImageToBase64 = (file: File): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (!file) {
        setImageError("Please select an image to convert.");
        setImageLoading(false);
        resolve(null);
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result as string;
        if (!base64Image) {
          setImageError("Failed to convert image to base64.");
          setImageLoading(false);
          resolve(null);
          return;
        }
        resolve(base64Image);
      };

      reader.onerror = () => {
        setImageError("Error reading file.");
        setImageLoading(false);
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  };

  const handleImageToSpeech = async () => {
    setImageLoading(true);
    setImageError("");
    if (!base64Image) {
      setImageError("Please select an image to proceed.");
      setImageLoading(false);
      return;
    }
    try {
      const res = await axios.post(
        `${apiUrl}/image-to-speech`,
        {
          image: {
            uri: base64Image,
            name: imageFile?.name,
            type: imageFile?.type,
          },
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // Important for handling binary data
        }
      );

      if (res.status !== 200) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const audioUrl = URL.createObjectURL(res.data);
      setImageAudioSrc(audioUrl);
    } catch (error: any) {
      console.error("Error generating image audio:", error);
      setImageError(error.message || "Failed to generate audio from image.");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-between ${geistSans.variable} ${geistMono.variable}`}
    >
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
            Text to Speech
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full p-4 mb-4 text-gray-100 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="Enter text to convert to speech..."
          />
          {text.length > 200 && (
            <p className="text-yellow-400 text-sm mb-4">
              ⚠️ Long text detected! Audio generation might take a bit longer.
              Please be patient. ⏳
            </p>
          )}
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

      {/* Image to Speech Section */}
      <section className="flex flex-col items-center justify-center py-10 px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg"
        >
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
            Image to Speech
          </h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-3 mb-4 text-gray-100 bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100"
          />
          {base64Image && (
            <div className="mb-4 text-center text-gray-300 flex justify-center items-center">
              <Image
                src={base64Image}
                alt="Selected"
                width={96} // Required width prop for Next.js Image
                height={96} // Required height prop for Next.js Image
                className="w-24 h-24 object-cover rounded-full"
              />
            </div>
          )}
          <button
            onClick={handleImageToSpeech}
            disabled={imageLoading}
            className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {imageLoading ? "Converting Image..." : "Convert Image to Speech"}
          </button>
          {imageError && (
            <p className="text-red-500 mt-4 text-center">{imageError}</p>
          )}
          {imageAudioSrc && (
            <div className="mt-6 w-full">
              <audio controls src={imageAudioSrc} className="w-full">
                Your browser does not support the audio element.
              </audio>
              <a
                href={imageAudioSrc}
                download="image_speech.mp3"
                className="block text-center text-pink-400 hover:underline mt-2"
              >
                Download Image Audio
              </a>
            </div>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-gray-400 text-sm border-t border-gray-700">
        <p>
          &copy; {new Date().getFullYear()} Tolatu. All rights reserved. Built
          with 💡 by
          <a
            href="https://github.com/auspicious14"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:underline"
          >
            Auspicious
          </a>
        </p>
      </footer>
    </div>
  );
};

export default TextToSpeech;
