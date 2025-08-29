import { motion } from "framer-motion";
import React from "react";
import { Voice } from "../services/api";

type TextToSpeechSectionProps = {
  text: string;
  setText: (text: string) => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: React.Dispatch<React.SetStateAction<Voice | null>>;
  audioSrc: string | null;
  loading: boolean;
  handleSubmit: () => void;
  error: string;
};

const TextToSpeechSection: React.FC<TextToSpeechSectionProps> = ({
  text,
  setText,
  voices,
  selectedVoice,
  setSelectedVoice,
  audioSrc,
  loading,
  handleSubmit,
  error,
}) => {
  return (
    <section className="flex flex-col items-center justify-center py-10 px-4 w-full mb-8">
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
        {error && <p className="text-red-500 mb-4">{error}</p>}
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
  );
};

export default TextToSpeechSection;
