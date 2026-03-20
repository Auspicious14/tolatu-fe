import React, { useState, useEffect } from "react";
import Head from "next/head";
import { toast } from "react-toastify";
import TextToSpeechSection from "../components/TextToSpeechSection";
import ImageToSpeechSection from "../components/ImageToSpeechSection";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WaveformDecor from "../components/WaveformDecor";
import { fetchVoices, textToSpeech, imageToSpeech, Voice } from "../services/api";

const getErr = (e: unknown) => (e instanceof Error ? e.message : String(e));

type Tab = "text" | "image";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  {
    id: "text",
    label: "Text to Speech",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    id: "image",
    label: "Image to Speech",
    icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  },
];

const WorkspacePage = () => {
  const [activeTab, setActiveTab] = useState<Tab>("text");

  const [text, setText] = useState("");
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [base64Image, setBase64Image] = useState("");
  const [imageAudioSrc, setImageAudioSrc] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchVoices()
      .then(vs => { setVoices(vs); if (vs.length) setSelectedVoice(vs[0]); })
      .catch(() => toast.error("Could not load voices."));
  }, []);

  const handleSubmit = async () => {
    if (!text.trim()) { setError("Please enter some text."); return; }
    if (!selectedVoice) { setError("Please select a voice."); return; }
    setLoading(true); setError("");
    try {
      const blob = await textToSpeech(text, selectedVoice.value);
      setAudioSrc(URL.createObjectURL(blob));
      toast.success("Audio generated!");
    } catch (e) { toast.error(getErr(e)); }
    finally { setLoading(false); }
  };

  const onImageDrop = (file: File) => {
    setImageFile(file); setImageError("");
    const reader = new FileReader();
    reader.onloadend = () => setBase64Image(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleImageToSpeech = async () => {
    if (!base64Image) { setImageError("Please upload an image."); return; }
    setImageLoading(true); setImageError("");
    try {
      const blob = await imageToSpeech(base64Image, imageFile);
      setImageAudioSrc(URL.createObjectURL(blob));
      toast.success("Image audio generated!");
    } catch (e) { toast.error(getErr(e)); }
    finally { setImageLoading(false); }
  };

  const anyLoading = loading || imageLoading;

  return (
    <>
      <Head><title>Workspace — Tolatu</title></Head>

      <div
        className="min-h-screen flex flex-col"
        style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}
      >
        <Navbar />

        <main className="flex-1 pt-20">
          <div className="max-w-3xl mx-auto px-5 pt-10 pb-6">
            {/* Page header */}
            <div className="flex items-end justify-between flex-wrap gap-4 mb-8">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest mb-1.5" style={{ color: "var(--amber)" }}>
                  Workspace
                </p>
                <h1
                  className="font-bold tracking-tight leading-none"
                  style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "var(--text)" }}
                >
                  Convert anything to audio
                </h1>
              </div>
              <WaveformDecor bars={22} height={32} active={anyLoading} barWidth={2.5} gap={2.5} />
            </div>

            {/* Tab switcher */}
            <div
              className="inline-flex items-center gap-1 p-1 rounded-xl mb-8"
              style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
            >
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all duration-200"
                  style={{
                    background: activeTab === tab.id ? "var(--amber)" : "transparent",
                    color: activeTab === tab.id ? "#1a0e00" : "var(--text2)",
                    fontWeight: activeTab === tab.id ? 500 : 400,
                    fontFamily: "var(--font-body)",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "text" && (
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
            )}
            {activeTab === "image" && (
              <ImageToSpeechSection
                base64Image={base64Image}
                onImageDrop={onImageDrop}
                handleImageToSpeech={handleImageToSpeech}
                imageLoading={imageLoading}
                imageError={imageError}
                imageAudioSrc={imageAudioSrc}
              />
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WorkspacePage;
