import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';

// Editorial configuration - Roman numerals and keys
const cardsConfig = [
  { number: 'I', key: 'wellnessRetreats' },
  { number: 'II', key: 'mindfulExperiences' },
  { number: 'III', key: 'alpineAdventures' },
  { number: 'IV', key: 'culturalImmersion' },
  { number: 'V', key: 'droneVideography' },
];

export default function WhatWeCurate() {
  const { t } = useTranslation('home');
  return (
    <section id="experiences" className="relative py-32 bg-background border-t border-white/5 scroll-mt-20">

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-6">
            Our Curation
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Beyond the <span className="italic text-white/50">guidebook.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {cardsConfig.map((card, index) => (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-background p-10 md:p-8 lg:p-10 flex flex-col justify-between min-h-[300px] hover:bg-white/5 transition-colors duration-500"
            >
              <div>
                <span className="text-switz-red font-serif text-xl italic opacity-60 mb-6 block group-hover:opacity-100 transition-opacity">
                  {card.number}
                </span>
                <h3 className="text-xl text-white font-serif mb-4 leading-heading">
                  {t(`whatWeCurate.${card.key}.title`)}
                </h3>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  {t(`whatWeCurate.${card.key}.description`)}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 group-hover:border-white/20 transition-colors">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">
                  {t(`whatWeCurate.${card.key}.audience`)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-24 text-xs text-white/30 tracking-[0.2em] uppercase font-light"
        >
          {t('whatWeCurate.footer')}
        </motion.p>
      </div>
    </section>
  );
}
