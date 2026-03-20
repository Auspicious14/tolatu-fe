import React from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Perfect for personal use and trying out Tolatu.",
    features: ["50 conversions / month", "Text to speech", "Image to speech", "Standard voices", "MP3 download"],
    cta: "Get started",
    href: "/workspace",
    featured: false,
  },
  {
    name: "Pro",
    price: "₦2,500",
    period: "/ month",
    desc: "For power users who need unlimited volume and premium voices.",
    features: ["Unlimited conversions", "All voice options", "Document upload (PDF)", "Nigerian accent voices", "Priority processing", "API access"],
    cta: "Coming soon",
    href: "#",
    featured: true,
  },
  {
    name: "Team",
    price: "₦8,000",
    period: "/ month",
    desc: "For teams and businesses with high-volume needs.",
    features: ["Everything in Pro", "5 team seats", "Custom voice training", "Bulk upload", "Analytics dashboard", "Priority support"],
    cta: "Coming soon",
    href: "#",
    featured: false,
  },
];

const PricingPage = () => (
  <>
    <Head><title>Pricing — Tolatu</title></Head>
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)", color: "var(--text)", fontFamily: "var(--font-body)" }}>
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-5xl mx-auto px-5 pt-16 pb-24">
          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
              Pricing
            </p>
            <h1
              className="font-extrabold tracking-tighter leading-none mb-4"
              style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.2rem, 6vw, 3.8rem)", color: "var(--text)" }}
            >
              Simple, honest pricing
            </h1>
            <p className="text-base font-light max-w-sm mx-auto" style={{ color: "var(--text2)" }}>
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div
                key={plan.name}
                className="relative rounded-2xl p-7 flex flex-col gap-6"
                style={{
                  background: plan.featured ? "var(--surface)" : "var(--bg2)",
                  border: plan.featured ? "1px solid rgba(232,148,58,0.35)" : "1px solid var(--border)",
                }}
              >
                {plan.featured && (
                  <div
                    className="absolute -top-px left-1/2 -translate-x-1/2 px-4 py-1 rounded-b-lg text-[10px] font-semibold uppercase tracking-widest"
                    style={{ background: "var(--amber)", color: "#1a0e00" }}
                  >
                    Most Popular
                  </div>
                )}

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest mb-3" style={{ color: "var(--amber)" }}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span
                      className="font-extrabold tracking-tighter"
                      style={{ fontFamily: "var(--font-display)", fontSize: "2.6rem", color: "var(--text)", letterSpacing: "-0.04em" }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-xs" style={{ color: "var(--text3)" }}>{plan.period}</span>
                  </div>
                  <p className="text-sm font-light" style={{ color: "var(--text2)" }}>{plan.desc}</p>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm font-light" style={{ color: "var(--text2)" }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className="mt-auto text-center text-sm font-medium py-3 rounded-xl no-underline transition-all duration-200"
                  style={{
                    background: plan.featured ? "var(--amber)" : "transparent",
                    color: plan.featured ? "#1a0e00" : "var(--text2)",
                    border: plan.featured ? "none" : "1px solid var(--border2)",
                    pointerEvents: plan.cta === "Coming soon" ? "none" : "auto",
                    opacity: plan.cta === "Coming soon" ? 0.45 : 1,
                  }}
                  onMouseEnter={e => { if (plan.featured && plan.cta !== "Coming soon") e.currentTarget.style.background = "var(--amber2)"; }}
                  onMouseLeave={e => { if (plan.featured) e.currentTarget.style.background = "var(--amber)"; }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </>
);

export default PricingPage;
