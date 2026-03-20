"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const isWorkspace = router.pathname === "/workspace";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="font-bold text-2xl tracking-tight text-[var(--amber)] no-underline" style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
        tolatu
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { href: "/#features", label: "Features" },
          { href: "/pricing",   label: "Pricing"  },
          { href: "/contact",   label: "Contact"  },
        ].map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="text-[var(--text2)] text-sm hover:text-[var(--text)] transition-colors no-underline"
          >
            {label}
          </Link>
        ))}

        <Link
          href="/workspace"
          className={`text-sm font-medium px-5 py-2 rounded-full no-underline transition-all duration-200 ${
            isWorkspace
              ? "bg-[var(--surface2)] text-[var(--text2)] border border-white/[0.1]"
              : "bg-[var(--amber)] text-[#1a0e00] hover:bg-[var(--amber2)]"
          }`}
        >
          Open App
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
