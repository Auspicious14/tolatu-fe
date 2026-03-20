import React from "react";
import { motion, Variants } from "framer-motion";

const features = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    title: "Natural Voices",
    desc: "Realistic voices including Nigerian English accents — audio that actually sounds human.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: "Instant Conversion",
    desc: "Paste a WhatsApp wall-of-text or a full article and get clean audio back in seconds.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: "Image to Audio",
    desc: "Upload a screenshot or photo with text — Tolatu reads it aloud. No typing needed.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    title: "Download & Share",
    desc: "Every audio file is yours. Download as MP3, play offline, or share anywhere.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: "Document Support",
    desc: "Upload PDFs and convert entire pages of content to spoken audio — no copy-paste.",
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    title: "Works Everywhere",
    desc: "Runs on any browser, any device. No app to install — just open and convert.",
  },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const Features = () => (
  <motion.div
    variants={container}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-60px" }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/[0.06] md:divide-x md:divide-y-0 border border-white/[0.06] rounded-2xl overflow-hidden"
    style={{ background: "var(--bg2)" }}
  >
    {features.map((f, i) => (
      <motion.div
        key={f.title}
        variants={item}
        className="group p-7 flex flex-col gap-3 cursor-default transition-colors duration-200 hover:bg-[var(--surface)]"
        style={{
          borderRight: i % 3 !== 2 ? "1px solid rgba(255,255,255,0.06)" : undefined,
          borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.06)" : undefined,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--amber-dim2)", border: "1px solid rgba(232,148,58,0.18)", color: "var(--amber)" }}
        >
          {f.icon}
        </div>
        <h3 className="text-base font-semibold tracking-tight text-[var(--text)]" style={{ fontFamily: "var(--font-display)" }}>
          {f.title}
        </h3>
        <p className="text-sm leading-relaxed font-light text-[var(--text2)]">
          {f.desc}
        </p>
      </motion.div>
    ))}
  </motion.div>
);

export default Features;
