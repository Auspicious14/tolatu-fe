import React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Loader2, UploadCloud, ImageIcon, Download } from "lucide-react";
import WaveformDecor from "./WaveformDecor";

type Props = {
  base64Image: string;
  onImageDrop: (file: File) => void;
  handleImageToSpeech: () => void;
  imageLoading: boolean;
  imageAudioSrc: string | null;
  imageError: string;
};

const ImageToSpeechSection: React.FC<Props> = ({
  base64Image, onImageDrop, handleImageToSpeech,
  imageLoading, imageAudioSrc, imageError,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: files => { if (files[0]) onImageDrop(files[0]); },
    accept: {
      "image/*":       [],
      "application/pdf": [],
      "text/plain":    [],
    },
    maxFiles: 1,
  });

  const fileLabel = (file: string) => {
    if (!file) return null;
    if (file.includes("application/pdf")) return "PDF uploaded";
    if (file.includes("text/plain"))      return "Text file uploaded";
    return null; // image — show preview
  };
  const uploadedLabel = fileLabel(base64Image);

  const canConvert = !imageLoading && !!base64Image;

  return (
    <div
      className="w-full rounded-2xl flex flex-col overflow-hidden"
      style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "var(--amber-dim2)", color: "var(--amber)" }}
            >
              <ImageIcon size={15} />
            </div>
            <h2
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Image to Speech
            </h2>
          </div>
          <p className="text-xs font-light pl-10" style={{ color: "var(--text2)" }}>
            Upload an image and we'll read the text aloud
          </p>
        </div>
        <WaveformDecor bars={14} height={26} active={imageLoading} barWidth={2} gap={2} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-6 py-5 flex-1">
        {/* Dropzone */}
        <div
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all duration-200 min-h-[200px]"
          style={{
            border: `1.5px dashed ${isDragActive ? "var(--amber)" : "var(--border2)"}`,
            background: isDragActive ? "var(--amber-dim)" : "var(--bg2)",
          }}
          onMouseEnter={e => { if (!isDragActive) (e.currentTarget.style.borderColor = "rgba(232,148,58,0.35)"); }}
          onMouseLeave={e => { if (!isDragActive) (e.currentTarget.style.borderColor = "var(--border2)"); }}
        >
          <input {...getInputProps()} />

          {base64Image ? (
            uploadedLabel ? (
              // PDF or TXT — show file icon + label
              <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: "var(--amber-dim2)", color: "var(--amber)" }}
                >
                  {base64Image.includes("application/pdf") ? (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  )}
                </div>
                <p className="text-sm font-light" style={{ color: "var(--amber2)" }}>{uploadedLabel}</p>
                <p className="text-xs" style={{ color: "var(--text3)" }}>Click to change</p>
              </div>
            ) : (
              // Image — show preview
              <div className="relative w-36 h-36 my-4">
                <Image src={base64Image} alt="Selected" fill className="object-cover rounded-xl" />
                <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs font-medium">Change</span>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-3 py-10 px-6 text-center">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "var(--amber-dim)", color: isDragActive ? "var(--amber)" : "var(--text2)" }}
              >
                <UploadCloud size={22} />
              </div>
              <div>
                <p className="text-sm font-light mb-1" style={{ color: isDragActive ? "var(--amber)" : "var(--text2)" }}>
                  {isDragActive ? "Drop it here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-xs" style={{ color: "var(--text3)" }}>
                  Images, PDFs, or .txt files
                </p>
              </div>
            </div>
          )}
        </div>

        {imageError && <p className="text-xs text-red-400">{imageError}</p>}

        {/* Info */}
        <div
          className="flex items-start gap-2.5 rounded-lg px-4 py-3 text-xs font-light leading-relaxed"
          style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text2)" }}
        >
          <svg className="shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Supports images, PDFs (up to 10 pages), and .txt files. Text is extracted with Gemini Vision then read aloud with Kokoro TTS.
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex flex-col gap-4">
        <button
          onClick={handleImageToSpeech}
          disabled={!canConvert}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: canConvert ? "var(--amber)" : "var(--surface2)",
            color: canConvert ? "#1a0e00" : "var(--text3)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={e => { if (canConvert) e.currentTarget.style.background = "var(--amber2)"; }}
          onMouseLeave={e => { if (canConvert) e.currentTarget.style.background = "var(--amber)"; }}
        >
          {imageLoading ? (
            <><Loader2 size={15} className="animate-spin-smooth" /> Reading image…</>
          ) : (
            <><ImageIcon size={15} /> Convert Image to Audio</>
          )}
        </button>

        {imageAudioSrc && (
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs font-light" style={{ color: "var(--text2)" }}>Audio ready</span>
            </div>
            <audio controls src={imageAudioSrc} className="w-full h-9" style={{ colorScheme: "dark" }} />
            <a
              href={imageAudioSrc}
              download="tolatu_image_audio.mp3"
              className="inline-flex items-center gap-1.5 text-xs font-medium no-underline transition-colors"
              style={{ color: "var(--amber)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--amber2)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--amber)")}
            >
              <Download size={12} /> Download MP3
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToSpeechSection;