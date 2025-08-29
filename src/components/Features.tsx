import { motion } from "framer-motion";

const features = [
  {
    icon: "🔊",
    title: "Natural Voices",
    desc: "Choose from a variety of realistic voices, including Nigerian accents.",
  },
  {
    icon: "⚡",
    title: "Fast Conversion",
    desc: "Instantly convert your text to high-quality audio in seconds.",
  },
  {
    icon: "🎧",
    title: "Download & Listen",
    desc: "Play audio directly or download it for offline use.",
  },
  {
    icon: "🌐",
    title: "Accessible Anywhere",
    desc: "Works on any device, anytime, anywhere.",
  },
];

const Features = () => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.2 } },
    }}
  >
    {features.map((f, i) => (
      <motion.div
        key={f.title}
        className="bg-gray-800 rounded-xl p-6 shadow-lg flex flex-col items-center hover:scale-105 transition-transform"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 + i * 0.15, duration: 0.6 }}
      >
        <span className="text-4xl mb-2">{f.icon}</span>
        <h3 className="text-xl font-semibold text-pink-400 mb-1">
          {f.title}
        </h3>
        <p className="text-gray-300 text-base">{f.desc}</p>
      </motion.div>
    ))}
  </motion.div>
);

export default Features;
