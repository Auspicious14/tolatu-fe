import Link from "next/link";

const Footer = () => (
  <footer className="w-full py-8 border-t border-gray-800">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-8 text-sm text-gray-400">
      <p>
        &copy; {new Date().getFullYear()} Tolatu. All rights reserved.
      </p>
      <div className="flex gap-6 mt-4 md:mt-0">
        <Link href="/#features" className="hover:text-pink-400 transition-colors">
          Features
        </Link>
        <Link href="/pricing" className="hover:text-pink-400 transition-colors">
          Pricing
        </Link>
        <Link href="/contact" className="hover:text-pink-400 transition-colors">
          Contact
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
