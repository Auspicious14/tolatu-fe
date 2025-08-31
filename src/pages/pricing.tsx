import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PricingPage = () => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white ${geistSans.variable} ${geistMono.variable}`}
    >
      <Navbar />
      <main className="pt-24 px-4">
        <div className="container mx-auto text-center py-20">
          <h1 className="text-5xl font-bold mb-4">Pricing</h1>
          <p className="text-xl">
            Choose the plan that's right for you.
          </p>
          {/* Pricing cards will go here */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
