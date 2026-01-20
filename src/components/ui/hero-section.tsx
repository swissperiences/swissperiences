'use client';
import React from 'react';
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
      <section className="relative w-full min-h-screen overflow-x-hidden flex items-center justify-center">
        {/* Simplified centralized layout for all devices */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-12 flex flex-col items-center justify-center min-h-screen text-center">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto"
          >
            {/* Editorial Headline */}
            <h1 className="text-white leading-none mb-8" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="block text-[13vw] md:text-[8rem] lg:text-[9.5rem] font-light tracking-tighter mix-blend-overlay opacity-90">
                {t('home:hero.title')}
              </span>
              <span className="block text-2xl md:text-3xl lg:text-4xl font-light italic mt-2 md:mt-4 opacity-80 tracking-wide font-sans">
                {t('home:hero.subtitle')}
              </span>
            </h1>

            {/* Minimalist Divider */}
            <div className="w-[1px] h-16 bg-white/20 mx-auto my-8 hidden md:block" />

            {/* Subtext */}
            <p className="mx-auto max-w-lg text-sm md:text-base text-white/70 font-light leading-relaxed tracking-wide mb-12">
              {t('home:hero.tagline1')} <br className="hidden md:block" /> {t('home:hero.tagline2')}
            </p>

            {/* Premium CTA */}
            <button
              onClick={() => {
                const element = document.querySelector('#experiences');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden transition-all duration-300"
            >
              <span className="absolute inset-0 border border-white/20 group-hover:border-white/40 transition-colors duration-300" />
              <span className="relative text-xs text-white uppercase tracking-[0.25em] group-hover:text-white transition-colors duration-300">
                {t('common:nav.requestAccess')}
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
              const element = document.querySelector('#experiences');
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