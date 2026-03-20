import React, { useState } from "react";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const inputCls = `
  w-full rounded-xl px-4 py-3 text-sm font-light outline-none transition-all duration-200
  placeholder:text-[color:var(--text3)]
`;

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const sharedStyle = {
    background: "var(--bg2)",
    border: "1px solid var(--border2)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
  };

  return (
    <>
      <Head><title>Contact — Tolatu</title></Head>
      <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="max-w-lg mx-auto px-5 pt-14 pb-24">
            <div className="mb-10">
              <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                Contact
              </p>
              <h1
                className="font-extrabold tracking-tighter leading-none mb-3"
                style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text)" }}
              >
                Say hello
              </h1>
              <p className="text-sm font-light" style={{ color: "var(--text2)" }}>
                Questions, feedback, or feature requests — we'd love to hear from you.
              </p>
            </div>

            {sent ? (
              <div
                className="rounded-2xl p-12 text-center"
                style={{ background: "var(--surface)", border: "1px solid rgba(74,222,128,0.15)" }}
              >
                <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center mx-auto mb-4">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>Message sent!</h3>
                <p className="text-sm font-light" style={{ color: "var(--text2)" }}>We'll get back to you shortly.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {[
                  { key: "name",    label: "Name",    type: "text",  placeholder: "Your name" },
                  { key: "email",   label: "Email",   type: "email", placeholder: "your@email.com" },
                ].map(field => (
                  <div key={field.key} className="flex flex-col gap-2">
                    <label className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text2)" }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      value={form[field.key as "name" | "email"]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className={inputCls}
                      style={sharedStyle}
                      onFocus={e => (e.currentTarget.style.borderColor = "var(--amber)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                    />
                  </div>
                ))}

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "var(--text2)" }}>
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="What's on your mind?"
                    rows={6}
                    className={`${inputCls} resize-y`}
                    style={{ ...sharedStyle, minHeight: 140 }}
                    onFocus={e => (e.currentTarget.style.borderColor = "var(--amber)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "var(--border2)")}
                  />
                </div>

                <button
                  onClick={() => { if (form.name && form.email && form.message) setSent(true); }}
                  className="w-full rounded-xl py-3.5 text-sm font-medium transition-colors duration-200"
                  style={{ background: "var(--amber)", color: "#1a0e00", fontFamily: "var(--font-body)", border: "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--amber2)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--amber)")}
                >
                  Send message
                </button>
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;
