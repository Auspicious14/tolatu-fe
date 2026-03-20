import React from "react";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import WaveformDecor from "../components/WaveformDecor";

const useCases = [
  { emoji: "💬", label: "Long WhatsApp messages" },
  { emoji: "📸", label: "Screenshots & images" },
  { emoji: "📄", label: "PDFs & documents" },
  { emoji: "🌐", label: "Articles & web content" },
];

const LandingPage = () => (
  <>
    <Head>
      <title>Tolatu — Hear Everything</title>
      <meta name="description" content="Convert text, images, and documents into natural-sounding audio instantly." />
    </Head>

    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-28 pb-20 overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "45%", left: "50%",
            transform: "translate(-50%, -55%)",
            width: 800, height: 480,
            background: "radial-gradient(ellipse, rgba(232,148,58,0.09) 0%, transparent 65%)",
          }}
        />
        {/* Grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 80% 65% at 50% 50%, black, transparent)",
          }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative z-10 inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest"
          style={{ background: "var(--amber-dim2)", border: "1px solid rgba(232,148,58,0.25)", color: "var(--amber2)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: "var(--amber)" }} />
          Text · Images · Docs → Audio
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 font-extrabold leading-none tracking-tighter mb-4"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 9vw, 6.8rem)",
            letterSpacing: "-0.045em",
            maxWidth: 860,
          }}
        >
          Stop reading.
          <br />
          <span style={{ color: "var(--amber)" }}>Start hearing.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.65 }}
          className="relative z-10 text-base md:text-lg font-light leading-relaxed mb-10 max-w-md mx-auto"
          style={{ color: "var(--text2)" }}
        >
          Paste a long WhatsApp message, upload a screenshot or PDF — Tolatu converts it into clear, natural audio in seconds.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="relative z-10 flex flex-wrap gap-3 justify-center"
        >
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium no-underline transition-all duration-200 hover:-translate-y-px"
            style={{ background: "var(--amber)", color: "#1a0e00" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--amber2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
          >
            Try it free
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link
            href="/#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-light no-underline transition-all duration-200"
            style={{ border: "1px solid var(--border2)", color: "var(--text2)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--amber)"; e.currentTarget.style.color = "var(--amber2)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}
          >
            See features
          </Link>
        </motion.div>

        {/* Hero waveform */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 1 }}
          className="relative z-10 mt-16"
        >
          <WaveformDecor bars={56} height={56} active={false} barWidth={3} gap={3} />
        </motion.div>
      </section>

      {/* ── USE CASE STRIP ── */}
      <div
        className="border-y border-white/[0.06] py-4 flex flex-wrap justify-center gap-x-10 gap-y-3 px-6"
        style={{ background: "var(--bg2)" }}
      >
        {useCases.map(({ emoji, label }) => (
          <div key={label} className="flex items-center gap-2 text-sm" style={{ color: "var(--text2)" }}>
            <span>{emoji}</span>
            <span className="font-light">{label}</span>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="px-5 py-24 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
            Why Tolatu
          </p>
          <h2
            className="font-bold leading-tight tracking-tighter"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text)" }}
          >
            Everything you need to listen,
            <br />
            <span style={{ color: "var(--amber2)" }}>not just read.</span>
          </h2>
        </div>
        <Features />
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-5 pb-24 max-w-6xl mx-auto">
        <div
          className="relative rounded-3xl text-center px-8 py-16 overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border2)" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(232,148,58,0.07), transparent)" }}
          />
          <h2
            className="relative z-10 font-bold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "var(--text)" }}
          >
            Your ears are waiting.
          </h2>
          <p className="relative z-10 text-base font-light mb-8" style={{ color: "var(--text2)" }}>
            No sign-up. No credit card. Just paste and listen.
          </p>
          <Link
            href="/workspace"
            className="relative z-10 inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium no-underline transition-colors duration-200"
            style={{ background: "var(--amber)", color: "#1a0e00" }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--amber2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
          >
            Open Tolatu →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  </>
);

export default LandingPage;
