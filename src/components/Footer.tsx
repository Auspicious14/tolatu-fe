import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-white/[0.06] px-6 md:px-10 py-7 flex flex-wrap items-center justify-between gap-4">
    <div className="flex items-center gap-2">
      <span className="font-extrabold text-lg tracking-tight text-[var(--amber)]" style={{ fontFamily: "var(--font-display)" }}>
        tolatu
      </span>
      <span className="text-xs text-[var(--text3)]">© {new Date().getFullYear()}</span>
    </div>
    <div className="flex gap-6">
      {[
        { href: "/#features", label: "Features" },
        { href: "/pricing",   label: "Pricing"  },
        { href: "/contact",   label: "Contact"  },
      ].map(({ href, label }) => (
        <Link
          key={label}
          href={href}
          className="text-xs text-[var(--text3)] hover:text-[var(--amber)] transition-colors no-underline"
        >
          {label}
        </Link>
      ))}
    </div>
  </footer>
);

export default Footer;
