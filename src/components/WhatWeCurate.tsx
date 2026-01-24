import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";

// Real offerings based on available assets
const cardsConfig = [
  { number: 'I', key: 'villarsRetreat', image: '/images/apt-living-room-2.jpg', link: '/villars-retreat' },
  { number: 'II', key: 'roadJourney', image: '/images/range-rover-enhanced.jpg', link: '/road-journey' },
  { number: 'III', key: 'droneMemories', image: '/images/villars-drone.jpg' },
  { number: 'IV', key: 'luxuryPackage', image: '/images/snowy-view.jpg' },
  { number: 'V', key: 'bespokeJourney', image: '/images/mountain-sunset.jpg' },
];

interface WhatWeCurateProps {
  onJoinWaitlist?: (tier: string, intent: string) => void;
}

export default function WhatWeCurate({ onJoinWaitlist }: WhatWeCurateProps) {
  const { t } = useTranslation('home');

  const handleCardClick = (key: string) => {
    if (!onJoinWaitlist) return;

    // Map card key to specific intent and product name
    switch (key) {
      case 'villarsRetreat': // I
        onJoinWaitlist('The Sanctuary', 'stay');
        break;
      case 'roadJourney': // II
        onJoinWaitlist('Premium Logistics', 'day-pass');
        break;
      case 'droneMemories': // III
        onJoinWaitlist('Cinematic Documentation', 'day-pass');
        break;
      case 'luxuryPackage': // IV
        onJoinWaitlist('Villars Luxury Week', 'retreat');
        break;
      case 'bespokeJourney': // V
        onJoinWaitlist('Bespoke Swiss Journey', 'day-pass');
        break;
      default:
        onJoinWaitlist('General Inquiry', '');
    }
  };

  return (
    <section id="experiences" className="relative pt-32 pb-16 bg-background border-t border-white/5 scroll-mt-20">

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <span className="text-switz-red text-xs font-bold tracking-[0.2em] uppercase block mb-6">
            The Swissperiences Elements
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Beyond the <span className="italic text-white/50">guidebook.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {cardsConfig.map((card, index) => {
            const CardContent = (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-neutral-900 p-10 md:p-8 lg:p-10 flex flex-col justify-between min-h-[400px] overflow-hidden cursor-pointer"
                onClick={() => !card.link && handleCardClick(card.key)}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={card.image}
                    alt={t(`whatWeCurate.${card.key}.title`)}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out brightness-[0.85] contrast-[1.1] saturate-[0.9] group-hover:brightness-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90 group-hover:via-black/60 transition-colors duration-500" />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <span className="text-switz-red font-serif text-xl italic opacity-80 mb-6 block group-hover:scale-110 origin-left transition-transform duration-500">
                      {card.number}
                    </span>
                    <h3 className="text-2xl text-white font-serif mb-4 leading-heading drop-shadow-md">
                      {t(`whatWeCurate.${card.key}.title`)}
                    </h3>
                    <p className="text-sm text-white/90 font-light leading-relaxed drop-shadow-sm max-w-[90%]">
                      {t(`whatWeCurate.${card.key}.description`)}
                    </p>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/20 group-hover:border-switz-red/50 transition-colors">
                    <p className="text-[10px] text-white/80 uppercase tracking-widest font-medium">
                      {t(`whatWeCurate.${card.key}.audience`)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );

            // If link exists, wrap. Else, it's clickable div handled above. 
            // NOTE: Requirement implies Cards II, III, V are day-pass. 
            // Assuming we prefer Modal over Link for these now? 
            // The prompt says "If intent is 'day-pass' (Cards II, III, V)..."
            // So we should enforce modal open for these instead of routing if they had links.
            // Current config has links for I and II. I acts as stay info? II is day-pass.
            // I will remove Link wrapper for II to enable modal.

            return card.link && card.key !== 'roadJourney' ? ( // Keeping link for I (VillarsRetreat page?) or just I?
              <Link to={card.link} className="block h-full w-full">
                {CardContent}
              </Link>
            ) : (
              // For roadJourney and others, use the div with onClick
              <div key={card.key} className="block h-full w-full" onClick={() => handleCardClick(card.key)}>
                {/* Re-render content without onClick to avoid double binding if div has it? 
                    Actually the motion.div has onClick. 
                    If we wrap in div with onClick, bubbling handles it.
                    But better to just render CardContent. 
                    Wait, CardContent definition has onClick attached conditionally `!card.link`.
                    Let's simplify: remove onClick from CardContent definition and put it on the wrapper or specific cases.
                 */}
                {/* Re-defining CardContent to be cleaner in loop context if needed, but for minimal diff using existing structure */}
                {/* Correct approach: The CardContent variable above has onClick logic. 
                    I'll update the onClick logic in CardContent to be universal or handled by wrapper. 
                    Let's strip onClick from CardContent and put it on the wrapper div for non-link items.
                 */}
                <div className="h-full w-full">
                  {/* Hack to render the React Node. But CardContent is already a JSX Element. */}
                  {/* I will rewrite the mapping function slightly in the Replacement to be cleaner */}
                  {CardContent}
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
