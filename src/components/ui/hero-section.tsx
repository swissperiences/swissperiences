import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Navigation from '@/components/Navigation';

interface HeroSectionProps {
  onJoinWaitlist?: () => void;
}

export function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  const { t } = useTranslation(['home', 'common']);
  return (
    <>
      <Navigation onWaitlistClick={() => onJoinWaitlist?.()} />
      <section className="relative w-full min-h-[100svh] overflow-x-hidden flex items-center justify-center">
        {/* Simplified centralized layout for all devices */}
        {/* Editorial container with luxurious mobile side margins and SVH centering */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-10 md:px-6 pt-20 pb-12 flex flex-col items-center justify-center min-h-[100svh] text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="max-w-5xl mx-auto relative px-4 py-16 md:px-12 md:py-24"
          >
            {/* The Sanctuary Guard: Radial Scrim & Blur for Total Legibility */}
            <div
              className="absolute inset-0 z-[-1] pointer-events-none backdrop-blur-[2px]"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 80%)',
                maskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)',
                WebkitMaskImage: 'radial-gradient(circle at center, black 0%, transparent 80%)'
              }}
            />

            {/* Editorial Headline with Refined Shadow */}
            <h1 className="text-white leading-none mb-8 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="block text-[13vw] md:text-[8rem] lg:text-[9.5rem] font-light tracking-[-0.02em] md:tracking-tighter opacity-95">
                {t('hero.title')}
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light italic mt-2 md:mt-4 opacity-90 tracking-widest font-sans uppercase text-[0.6em] md:text-[1em] drop-shadow-md">
                {t('hero.subtitle')}
              </span>
            </h1>

            {/* Minimalist Divider */}
            <div className="w-[1px] h-16 bg-white/20 mx-auto my-8 hidden md:block" />

            {/* Subtext with improved contrast */}
            <p className="mx-auto max-w-lg text-sm md:text-base text-white/90 font-light leading-relaxed tracking-wide mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
              {t('hero.tagline1')} <br className="hidden md:block" />
              {t('hero.tagline2')}
            </p>

            {/* Premium CTA with Antigravity Glassmorphism and Haptic Active State */}
            <button
              onClick={() => {
                const element = document.querySelector('#upcoming-retreats');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden transition-all duration-700 ease-swiss-luxury rounded-sm active:scale-[0.98]"
            >
              <span className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 group-hover:border-white/40 transition-all duration-700 ease-swiss-luxury" />
              <span className="relative text-xs text-white uppercase tracking-[0.3em] group-hover:text-white transition-all duration-700 ease-swiss-luxury">
                Check Availability
              </span>
            </button>
          </motion.div>

          {/* Bottom Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
            onClick={() => {
              const element = document.querySelector('#upcoming-retreats');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Scroll</span>
            <div className="w-[1px] h-12 bg-white/10" />
          </motion.div>
        </div>
      </section>
    </>
  );
}