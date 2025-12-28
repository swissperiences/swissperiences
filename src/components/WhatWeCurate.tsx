import { motion } from "framer-motion";
import { Mountain, Leaf, Palette, Wind } from "lucide-react";

const cards = [
  {
    icon: Leaf,
    title: "Wellness Retreats",
    description: "Digital detox escapes in Swiss mountain sanctuaries",
    audience: "For executives & creatives seeking reset",
  },
  {
    icon: Mountain,
    title: "Alpine Adventures",
    description: "Guided hikes to hidden peaks and pristine lakes",
    audience: "For teams & solo explorers",
  },
  {
    icon: Palette,
    title: "Cultural Immersion",
    description: "Artisan workshops and local Swiss traditions",
    audience: "For curious minds & culture seekers",
  },
  {
    icon: Wind,
    title: "Mindful Experiences",
    description: "Meditation, yoga, and breathwork in nature",
    audience: "For those seeking stillness",
  },
];

export default function WhatWeCurate() {
  return (
    <section id="experiences" className="bg-black py-20 sm:py-24 scroll-mt-20 grain-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-[0.3em] text-white/80 mb-16 text-center uppercase font-light"
        >
          What We Curate
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Wellness Retreats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0, ease: "easeOut" }}
            className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 cursor-default bg-black/50"
          >
            <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-colors duration-300">
              <Leaf className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Wellness Retreats
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Digital detox escapes in Swiss mountain sanctuaries
            </p>
            <p className="text-xs text-white/40 italic">
              Executives & creatives seeking a reset
            </p>
          </motion.div>

          {/* Card 2: Mindful Experiences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
            className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 cursor-default bg-black/50"
          >
            <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-colors duration-300">
              <Wind className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Mindful Experiences
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Meditation, yoga, and breathwork in nature
            </p>
            <p className="text-xs text-white/40 italic">
              Individuals reconnecting with their center
            </p>
          </motion.div>

          {/* Card 3: Alpine Adventures */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 cursor-default bg-black/50"
          >
            <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-colors duration-300">
              <Mountain className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Alpine Adventures
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Guided hikes to hidden peaks and pristine lakes
            </p>
            <p className="text-xs text-white/40 italic">
              Explorers searching for raw nature
            </p>
          </motion.div>

          {/* Card 4: Cultural Immersion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px", amount: 0.3 }}
            transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
            className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/30 transition-all duration-300 cursor-default bg-black/50"
          >
            <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-colors duration-300">
              <Palette className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">
              Cultural Immersion
            </h3>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Artisan workshops and local Swiss traditions
            </p>
            <p className="text-xs text-white/40 italic">
              Travelers valuing depth over sight-seeing
            </p>
          </motion.div>
        </div>

        {/* Footer Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-24 text-xs text-white/50 tracking-wide font-light"
        >
          Each experience is curated individually. Access is limited.
        </motion.p>
      </div>
    </section>
  );
}
