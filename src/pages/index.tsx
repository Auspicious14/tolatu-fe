import React from "react";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const LandingPage = () => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white ${geistSans.variable} ${geistMono.variable}`}
    >
      <Navbar />
      <main className="pt-24">
        {/* Hero Section */}
        <section className="text-center py-20 px-4">
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6 text-pink-500 drop-shadow-lg"
          >
            Bring Your Content to Life
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto"
          >
            Effortlessly convert text and images into natural-sounding speech.
            Perfect for creators, educators, and anyone looking to make their
            content more accessible.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Link
              href="/workspace"
              className="px-8 py-4 bg-pink-500 rounded-lg font-semibold text-xl hover:bg-pink-600 transition-colors transform hover:scale-105"
            >
              Get Started for Free
            </Link>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
              Why Choose Tolatu?
            </h2>
            <Features />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
