import { motion } from "framer-motion";
import { Mountain, Leaf, Palette, Wind, Video } from "lucide-react";
import { useTranslation } from 'react-i18next';

// Card configuration - icons and translation keys
// TODO: Replace icons with real photos when available (aspect-square images with object-cover)
const cardsConfig = [
  { icon: Leaf, key: 'wellnessRetreats' },
  { icon: Wind, key: 'mindfulExperiences' },
  { icon: Mountain, key: 'alpineAdventures' },
  { icon: Palette, key: 'culturalImmersion' },
  { icon: Video, key: 'droneVideography' },
];

export default function WhatWeCurate() {
  const { t } = useTranslation('home');
  return (
    <section id="experiences" className="relative py-20 sm:py-24 scroll-mt-20">
      {/* Darker overlay for experiences section */}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-sm tracking-[0.3em] text-white/80 mb-16 text-center uppercase font-light"
        >
          {t('whatWeCurate.heading')}
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {cardsConfig.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px", amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
                className="group p-6 sm:p-8 border border-white/10 rounded-xl hover:border-white/40 hover:-translate-y-1 transition-all duration-300 cursor-default bg-black/30 backdrop-blur-sm hover:bg-white/5"
              >
                <div className="aspect-square w-12 h-12 flex items-center justify-center rounded-lg bg-white/5 mb-6 group-hover:bg-white/10 transition-all duration-300">
                  <Icon className="w-6 h-6 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                </div>
                <h3 className="text-lg text-white mb-3">
                  {t(`whatWeCurate.${card.key}.title`)}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {t(`whatWeCurate.${card.key}.description`)}
                </p>
                <p className="text-xs text-white/40 italic">
                  {t(`whatWeCurate.${card.key}.audience`)}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-24 text-xs text-white/50 tracking-wide font-light"
        >
          {t('whatWeCurate.footer')}
        </motion.p>
      </div>
    </section>
  );
}
