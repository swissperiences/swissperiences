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
    <section id="experiences" className="bg-black py-32 sm:py-40 scroll-mt-20 grain-overlay">
      <div className="max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-xs tracking-widest text-white/60 mb-16 text-center uppercase"
        >
          What We Curate
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/30 hover:scale-105 hover:shadow-xl hover:shadow-white/5 transition-all duration-300 cursor-default bg-black/50"
            >
              <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-colors duration-300">
                <card.icon className="w-6 h-6 text-white/70 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {card.description}
              </p>
              <p className="text-xs text-white/40 italic">
                {card.audience}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
