'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeroSectionProps {
  onJoinWaitlist?: () => void;
}

export function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  const { t } = useTranslation(['home', 'common']);
  return (
    <>
      <HeroHeader onJoinWaitlist={onJoinWaitlist} />
      <section className="relative w-full min-h-screen overflow-x-hidden">
        {/* Video background is now global - no local video needed */}

        {/* --- MOBILE LAYOUT (One idea per viewport) --- */}
        <div className="relative z-10 flex flex-col md:hidden">

          {/* Viewport 1: The Hook - Pure & Simple */}
          <div className="flex min-h-[100dvh] pt-20 w-full flex-col items-center justify-center px-6 text-center">
            {/* Note: Removed pre-header for absolute focus */}
            <h1 className="text-white leading-[1.2]" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.15)" }}>
              <span className="block text-[3rem] font-light tracking-tight">
                {t('home:hero.title')}
              </span>
              <span className="block text-[2.2rem] font-extralight mt-4 opacity-95 tracking-wide">
                {t('home:hero.subtitle')}
              </span>
            </h1>
          </div>

          {/* Viewport 2: The Resolution & Action */}
          <div className="flex min-h-[85vh] pt-20 w-full flex-col items-center justify-center px-6 text-center pb-24 bg-gradient-to-b from-transparent to-black/40">
            <h1 className="text-white leading-[1.2] mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: "0 2px 12px rgba(0,0,0,0.4), 0 0 40px rgba(255,255,255,0.15)" }}>
              <span className="block text-[3rem] font-light tracking-tight">
                {t('home:hero.title')}
              </span>
              <span className="block text-[2.2rem] font-extralight mt-4 opacity-95 tracking-wide">
                {t('home:hero.subtitle')}
              </span>
            </h1>

            <p className="mx-auto text-sm text-white font-light leading-relaxed drop-shadow-md">
              {t('home:hero.tagline2')}
            </p>

            <div className="mt-10 flex justify-center">
              <button
                onClick={onJoinWaitlist}
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
                onClick={onJoinWaitlist}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">{t('common:nav.requestAccess')}</span>
              </button>
            </div>

          </motion.div>

          {/* Scroll Indicator - Outside motion.div to avoid absolute positioning conflicts */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            onClick={() => {
              const element = document.querySelector('#experiences');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="text-white/60 text-xs uppercase tracking-widest">{t('common:scroll')}</span>
            <motion.div
              className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
              animate={{
                scaleY: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}

// Menu items structure - translations will be applied in HeroHeader
const menuItemsConfig = [
  { key: 'experiences', href: '#experiences' },
  { key: 'howItWorks', href: '#how-it-works' },
  { key: 'forTeams', href: '/for-teams' },
];

/**
 * HeroHeader - Navigation component integrated with HeroSection
 *
 * NOTE: This component is similar to the standalone Navigation component
 * TODO: Consider consolidating both into a single shared navigation component
 *
 * Current usage:
 * - Embedded in HeroSection (Index page with hero video)
 * - Navigation.tsx is used in ForTeams page (standalone)
 */
const HeroHeader = ({ onJoinWaitlist }: { onJoinWaitlist?: () => void }) => {
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['common']);

  // Generate menu items with translated names
  const menuItems = menuItemsConfig.map(item => ({
    name: t(`common:nav.${item.key}`),
    href: item.href.startsWith('/') ? `/${i18n.language}${item.href}` : item.href,
  }));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 90);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuState(false);
    if (href.startsWith('/')) {
      navigate(href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header>
      <motion.nav
        data-state={menuState && 'active'}
        className="group fixed top-6 left-1/2 -translate-x-1/2 z-50"
        initial={{
          width: '95%',
          maxWidth: '1280px',
        }}
        animate={{
          width: scrolled ? 'auto' : '95%',
          maxWidth: scrolled ? 'fit-content' : '1280px',
        }}
        transition={{
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {/* Pieces-style materializing pill background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: scrolled ? 1 : 0,
            scale: scrolled ? 1 : 0.8,
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1], // Pieces.app easing curve
          }}
          className="absolute inset-0 bg-[#1A1614]/95 backdrop-blur-lg border border-white/10 rounded-full"
          style={{ pointerEvents: 'none' }}
        />

        <div className="relative rounded-full px-8 py-4 text-white">
          <div className="relative flex items-center justify-between gap-6">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center space-x-2 text-lg font-light uppercase tracking-[0.3em] hover:opacity-80 transition-opacity text-white"
              aria-label="home"
            >
              Swissperiences
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <ul className="flex gap-10 text-sm font-light tracking-wide">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="group relative block duration-300 transition-all text-white/70 hover:text-white"
                    >
                      <span>{item.name}</span>
                      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/60 transition-all duration-300 group-hover:w-full group-hover:bg-white" />
                    </button>
                  </li>
                ))}
              </ul>

              {/* Desktop: Language Switcher + CTA */}
              <div className="flex items-center gap-6">
                <LanguageSwitcher />
                <Button
                  onClick={() => onJoinWaitlist?.()}
                  className="rounded-full px-8 py-2.5 font-light tracking-wide"
                  variant="hero"
                >
                  {t('common:nav.requestAccess')}
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuState(!menuState)}
              aria-label={menuState ? 'Close Menu' : 'Open Menu'}
              className="relative z-50 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden hover:bg-white/5 rounded-full transition-colors"
            >
              {menuState ? (
                <X className="size-5 duration-200 text-white" />
              ) : (
                <Menu className="size-5 duration-200 text-white" />
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {menuState && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden absolute top-full left-0 right-0 mt-4 bg-[#1A1614]/98 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
            >
              <ul className="space-y-5 text-base font-light tracking-wide text-white/70">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="hover:text-white block duration-300 transition-colors w-full text-left py-1.5"
                    >
                      <span>{item.name}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Mobile: Language Switcher */}
              <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
                <LanguageSwitcher />
              </div>

              {/* Mobile: CTA Button */}
              <div className="mt-7">
                <Button
                  onClick={() => {
                    setMenuState(false);
                    onJoinWaitlist?.();
                  }}
                  className="rounded-full w-full font-light tracking-wide"
                  variant="hero"
                >
                  {t('common:nav.requestAccess')}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.nav>
    </header>
  );
};
