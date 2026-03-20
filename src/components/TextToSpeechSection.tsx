import React from "react";
import { Voice } from "../services/api";
import { Loader2, Volume2, Download } from "lucide-react";
import WaveformDecor from "./WaveformDecor";

type Props = {
  text: string;
  setText: (t: string) => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: React.Dispatch<React.SetStateAction<Voice | null>>;
  audioSrc: string | null;
  loading: boolean;
  handleSubmit: () => void;
  error: string;
};

const TextToSpeechSection: React.FC<Props> = ({
  text, setText, voices, selectedVoice, setSelectedVoice,
  audioSrc, loading, handleSubmit, error,
}) => {
  const charCount = text.length;
  const isLong = charCount > 2000;
  const canSubmit = !loading && text.trim().length > 0;

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
              <Volume2 size={15} />
            </div>
            <h2
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
            >
              Text to Speech
            </h2>
          </div>
          <p className="text-xs font-light pl-10" style={{ color: "var(--text2)" }}>
            Paste any text and convert to natural audio
          </p>
        </div>
        <WaveformDecor bars={14} height={26} active={loading} barWidth={2} gap={2} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-6 py-5 flex-1">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your text here — WhatsApp messages, articles, anything long you don't want to read..."
            rows={9}
            className="w-full resize-y rounded-xl px-4 py-3.5 text-sm font-light leading-relaxed outline-none transition-all duration-200 placeholder:text-[var(--text3)]"
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border2)",
              color: "var(--text)",
              fontFamily: "var(--font-body)",
              minHeight: 200,
            }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--amber)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--border2)")}
          />
          <span
            className="absolute bottom-3 right-3.5 text-[11px]"
            style={{ color: isLong ? "var(--amber)" : "var(--text3)" }}
          >
            {charCount.toLocaleString()}
          </span>
        </div>

        {/* Long text warning */}
        {isLong && (
          <div
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs"
            style={{ background: "rgba(232,148,58,0.08)", border: "1px solid rgba(232,148,58,0.2)", color: "var(--amber2)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            Long text — generation may take a moment
          </div>
        )}

        {/* Error */}
        {error && <p className="text-xs text-red-400">{error}</p>}

        {/* Voice select */}
        <div className="flex flex-col gap-2">
          <label className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text2)" }}>
            Voice
          </label>
          <div className="relative">
            <select
              value={selectedVoice?.value ?? ""}
              onChange={e => {
                const v = voices.find(v => v.value === e.target.value);
                if (v) setSelectedVoice(v);
              }}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none appearance-none transition-all duration-200 cursor-pointer pr-9"
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border2)",
                color: selectedVoice ? "var(--text)" : "var(--text2)",
                fontFamily: "var(--font-body)",
              }}
              onFocus={e => (e.currentTarget.style.borderColor = "var(--amber)")}
              onBlur={e => (e.currentTarget.style.borderColor = "var(--border2)")}
            >
              <option value="" disabled style={{ background: "#1c1c21" }}>Select a voice…</option>
              {voices.map(v => (
                <option key={v.value} value={v.value} style={{ background: "#1c1c21" }}>
                  {v.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text2)" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex flex-col gap-4">
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            background: canSubmit ? "var(--amber)" : "var(--surface2)",
            color: canSubmit ? "#1a0e00" : "var(--text3)",
            fontFamily: "var(--font-body)",
          }}
          onMouseEnter={e => { if (canSubmit) e.currentTarget.style.background = "var(--amber2)"; }}
          onMouseLeave={e => { if (canSubmit) e.currentTarget.style.background = "var(--amber)"; }}
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin-smooth" /> Generating audio…</>
          ) : (
            <><Volume2 size={15} /> Convert to Audio</>
          )}
        </button>

        {audioSrc && (
          <div
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{ background: "var(--bg2)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-xs font-light" style={{ color: "var(--text2)" }}>Audio ready</span>
            </div>
            <audio controls src={audioSrc} className="w-full h-9" style={{ colorScheme: "dark" }} />
            <a
              href={audioSrc}
              download="tolatu_audio.mp3"
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

export default TextToSpeechSection;
