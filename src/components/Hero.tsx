import { motion } from "framer-motion";

const Hero = () => (
  <section className="flex-1 flex flex-col justify-center items-center py-16 px-4 text-center">
    <motion.h1
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-5xl md:text-6xl font-bold mb-6 text-pink-500 drop-shadow-lg"
    >
      Tolatu: Effortless Text to Speech
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8 }}
      className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto"
    >
      Instantly convert your text to natural-sounding audio with support for
      multiple voices and languages. Perfect for accessibility,
      productivity, and fun!
    </motion.p>
  </section>
);

export default Hero;
