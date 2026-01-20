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
      <section className="relative w-full min-h-screen overflow-x-hidden">
        {/* Video background is now global - no local video needed */}

        {/* --- MOBILE LAYOUT (Simplified to single viewport) --- */}
        <div className="relative z-10 flex flex-col md:hidden">
          {/* Single unified mobile hero */}
          <div className="flex min-h-[100dvh] pt-20 w-full flex-col items-center justify-center px-6 text-center pb-24">
            <h1 className="text-white leading-[1.2] mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.15)" }}>
              <span className="block text-[3rem] font-light tracking-tight">
                {t('home:hero.title')}
              </span>
              <span className="block text-[2.2rem] font-extralight mt-4 opacity-95 tracking-wide">
                {t('home:hero.subtitle')}
              </span>
            </h1>

            <p className="mx-auto max-w-md text-sm text-white/90 font-light leading-relaxed" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {t('home:hero.tagline1')}
            </p>

            <p className="mx-auto max-w-md mt-4 text-sm text-white/90 font-light leading-relaxed" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {t('home:hero.tagline2')}
            </p>

            <div className="mt-12 flex justify-center">
              <button
                onClick={() => {
                  const element = document.querySelector('#experiences');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">{t('common:nav.requestAccess')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (Preserved) --- */}
        <div className="relative z-10 hidden md:flex min-h-screen pt-24 items-center justify-center px-6">
          <motion.div
            className="mx-auto w-full max-w-6xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Headline */}
            <h1 className="text-white leading-[1.15]" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.15)" }}>
              <span className="block text-[clamp(4rem,7vw,8rem)] font-light tracking-tight">
                {t('home:hero.title')}
              </span>
              <span className="block text-[clamp(3rem,5.5vw,7rem)] font-extralight mt-6 opacity-95 tracking-wide">
                {t('home:hero.subtitle')}
              </span>
            </h1>

            {/* Subheadline: Maximum contrast */}
            <div className="space-y-4 mt-10">
              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/95 font-normal leading-relaxed" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)" }}>
                {t('home:hero.tagline1')}
              </p>
              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/95 font-normal leading-relaxed" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)" }}>
                {t('home:hero.tagline2')}
              </p>
            </div>

            {/* Micro-phrase: High visibility */}
            <p className="mx-auto mt-8 text-sm text-white/95 font-medium tracking-wide" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)" }}>
              {t('home:hero.microPhrase')}
            </p>

            {/* CTA */}
            <div className="mt-[12vh] flex justify-center">
              <button
                onClick={() => {
                  const element = document.querySelector('#experiences');
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">{t('common:nav.requestAccess')}</span>
              </button>
            </div>

          </motion.div>

          {/* Scroll Indicator - Simplified (removed decorative animation) */}
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20 opacity-80 hover:opacity-100 transition-opacity"
            onClick={() => {
              const element = document.querySelector('#experiences');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-white/60 text-xs uppercase tracking-widest">{t('common:scroll')}</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </section>
    </>
  );
}