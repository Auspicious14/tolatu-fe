import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { toast } from "react-toastify";
import Hero from "../components/Hero";
import Features from "../components/Features";
import TextToSpeechSection from "../components/TextToSpeechSection";
import ImageToSpeechSection from "../components/ImageToSpeechSection";
import Footer from "../components/Footer";
import {
  fetchVoices,
  textToSpeech,
  imageToSpeech,
  Voice,
} from "../services/api";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const TextToSpeechPage = () => {
  const [text, setText] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [base64Image, setBase64Image] = useState<string>("");
  const [imageAudioSrc, setImageAudioSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voiceOptions = await fetchVoices();
        setVoices(voiceOptions);
        if (voiceOptions.length > 0) {
          setSelectedVoice(voiceOptions[0]);
        }
      } catch (err) {
        console.error("Failed to load voices", err);
        toast.error("Could not load available voices.");
      }
    };
    loadVoices();
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert to audio.");
      return;
    }
    if (!selectedVoice) {
      setError("Please select a voice.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const blob = await textToSpeech(text, selectedVoice.value);
      const audioUrl = URL.createObjectURL(blob);
      setAudioSrc(audioUrl);
      toast.success("Audio generated successfully!");
    } catch (error: unknown) {
      console.error("Error generating audio:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const onImageDrop = (file: File) => {
    setImageFile(file);
    setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageToSpeech = async () => {
    if (!base64Image) {
      setImageError("Please select an image to proceed.");
      return;
    }
    setImageLoading(true);
    setImageError("");
    try {
      const blob = await imageToSpeech(base64Image, imageFile);
      const audioUrl = URL.createObjectURL(blob);
      setImageAudioSrc(audioUrl);
      toast.success("Image audio generated successfully!");
    } catch (error: unknown) {
      console.error("Error generating image audio:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-between ${geistSans.variable} ${geistMono.variable}`}
    >
      <main className="flex-1 flex flex-col items-center justify-center w-full">
        <Hero />
        <Features />
        <TextToSpeechSection
          text={text}
          setText={setText}
          voices={voices}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          audioSrc={audioSrc}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
        />
        <ImageToSpeechSection
          base64Image={base64Image}
          onImageDrop={onImageDrop}
          handleImageToSpeech={handleImageToSpeech}
          imageLoading={imageLoading}
          imageError={imageError}
          imageAudioSrc={imageAudioSrc}
        />
      </main>
      <Footer />
    </div>
  );
};

export default TextToSpeechPage;
