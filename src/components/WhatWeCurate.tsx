import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

const pillarsConfig = [
  {
    number: 'I',
    key: 'pillar1', // The Alpine Sanctuary
    image: '/images/villars-feature.jpg',
    link: '/sanctuaries/villars'
  },
  {
    number: 'II',
    key: 'pillar2', // Swiss Alps Road Journey
    image: '/images/range-rover-enhanced.jpg',
    link: '/experiences/road-journey'
  },
  {
    number: 'III',
    key: 'pillar3', // Cinematic Swiss Memories
    image: '/images/villars-drone.jpg',
    link: '/experiences/cinematic-memories'
  }
];

interface WhatWeCurateProps {
  onJoinWaitlist?: (tier: string, intent: string) => void;
}

export default function WhatWeCurate({ onJoinWaitlist }: WhatWeCurateProps) {
  const { t } = useTranslation('home');

  const handleCardClick = (key: string) => {
    if (!onJoinWaitlist) return;

    switch (key) {
      case 'pillar1':
        onJoinWaitlist('The Alpine Sanctuary', 'stay');
        break;
      case 'pillar2':
        onJoinWaitlist('Swiss Alps Road Journey', 'day-pass');
        break;
      case 'pillar3':
        onJoinWaitlist('Cinematic Swiss Memories', 'day-pass');
        break;
      default:
        onJoinWaitlist('General Inquiry', '');
    }
  };

  return (
    <section id="elements" className="relative min-h-[100svh] pt-32 pb-16 bg-background border-t border-white/5 scroll-mt-20 flex items-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-24"
        >
          <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-6">
            {t('whatWeCurate.heading')}
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Beyond the <span className="italic text-white/50">guidebook.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {pillarsConfig.map((pillar, index) => {
            const CardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: index * 0.15 }}
                className="group relative bg-neutral-900 p-10 md:p-8 lg:p-10 flex flex-col justify-between min-h-[500px] overflow-hidden cursor-pointer"
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={pillar.image}
                    alt={t(`whatWeCurate.${pillar.key}.title`)}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 group-hover:via-black/60 transition-colors duration-500" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-switz-red font-serif text-xl italic opacity-80 mb-6 block group-hover:scale-110 origin-left transition-transform duration-500">
                      {pillar.number}
                    </span>
                    <h3 className="text-2xl text-white font-serif mb-4 leading-heading drop-shadow-md">
                      {t(`whatWeCurate.${pillar.key}.title`)}
                    </h3>
                    <p className="text-sm text-white/90 font-light leading-relaxed drop-shadow-sm max-w-[90%]">
                      {t(`whatWeCurate.${pillar.key}.description`)}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 group-hover:border-switz-red/50 transition-colors">
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">
                      {t(`whatWeCurate.${pillar.key}.audience`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

            if (pillar.link) {
              return (
                <Link key={pillar.key} to={pillar.link} className="block h-full w-full">
                  {CardContent}
                </Link>
              );
            }

            return (
              <div key={pillar.key} className="block h-full w-full" onClick={() => handleCardClick(pillar.key)}>
                {CardContent}
              </div>
            );
          })}
        </div>
      </div>
    </section >
  );
}
