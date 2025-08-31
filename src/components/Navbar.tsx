import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-8 bg-gray-900 bg-opacity-50 backdrop-blur-md fixed top-0 z-10 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-500">
          Tolatu
        </Link>
        <div className="hidden md:flex items-center gap-6 text-gray-300">
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
        <Button asChild>
          <Link href="/workspace">Go to App</Link>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
