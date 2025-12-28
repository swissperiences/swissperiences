'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onJoinWaitlist?: () => void;
}

export function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
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
            <h1 className="text-white leading-[1.2] drop-shadow-lg">
              <span className="block text-[3rem] font-normal tracking-wide">
                Switzerland.
              </span>
              <span className="block text-[2.2rem] font-light mt-4 opacity-90 tracking-wide">
                A state of mind.
              </span>
            </h1>
          </div>

          {/* Viewport 2: The Resolution & Action */}
          <div className="flex min-h-[85vh] pt-20 w-full flex-col items-center justify-center px-6 text-center pb-24 bg-gradient-to-b from-transparent to-black/40">
            <h1 className="text-white leading-[1.2] drop-shadow-lg mb-8">
              <span className="block text-[3rem] font-normal tracking-wide">
                Switzerland.
              </span>
              <span className="block text-[2.2rem] font-light mt-4 opacity-90 tracking-wide">
                A state of mind.
              </span>
            </h1>

            <p className="mx-auto text-sm text-white font-light leading-relaxed drop-shadow-md">
              Curated Swiss experiences.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                onClick={onJoinWaitlist}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">Request Access</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (Preserved) --- */}
        <div className="relative z-10 hidden md:flex min-h-screen pt-24 items-center justify-center px-6">
          <div className="mx-auto w-full max-w-6xl text-center">
            <div className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-white/90" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)" }}>
              Curated in Switzerland
            </div>

            {/* Headline */}
            <h1 className="text-white leading-[1.15]" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}>
              <span className="block text-[clamp(4rem,7vw,8rem)] font-normal tracking-wide">
                Switzerland.
              </span>
              <span className="block text-[clamp(3rem,5.5vw,7rem)] font-light mt-6 opacity-90 tracking-wide">
                A state of mind.
              </span>
            </h1>

            {/* Subheadline: Maximum contrast */}
            <div className="space-y-3 mt-8">
              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/95 font-normal leading-relaxed" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)" }}>
                Immersive nature. For those seeking less noise and more feeling.
              </p>
              <p className="mx-auto max-w-2xl text-base md:text-lg text-white/95 font-normal leading-relaxed" style={{ textShadow: "0 2px 12px rgba(0,0,0,0.6), 0 1px 4px rgba(0,0,0,0.4)" }}>
                Curated Swiss experiences — from intimate moments to immersive journeys.
              </p>
            </div>

            {/* Micro-phrase: High visibility */}
            <p className="mx-auto mt-6 text-sm text-white/95 font-medium tracking-wide" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.3)" }}>
              Inquiries limited. Curated individually.
            </p>

            {/* CTA */}
            <div className="mt-[12vh] flex justify-center">
              <button
                onClick={onJoinWaitlist}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">Request Access</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const menuItems = [
  { name: 'Experiences', href: '#experiences' },
  { name: 'How It Works', href: '#how-it-works' },
  { name: 'For Teams', href: '/for-teams' },
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

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
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
      <nav
        data-state={menuState && 'active'}
        className="group fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
      >
        <div
          className={cn(
            'rounded-full px-8 py-4 transition-all duration-500 ease-in-out text-white',
            scrolled
              ? 'bg-[#1A1614]/95 backdrop-blur-lg border border-white/10'
              : 'bg-transparent backdrop-blur-sm border border-white/20'
          )}
        >
          <motion.div
            className="relative flex flex-wrap items-center justify-between gap-6 duration-200 lg:gap-0"
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex items-center space-x-2 text-lg uppercase tracking-[0.2em] hover:opacity-80 transition-opacity text-white"
                aria-label="home"
              >
                Swissperiences
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-50 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-white" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-white" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="block duration-150 transition-colors text-white/80 hover:text-white"
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-[#1A1614]/80 backdrop-blur-xl lg:bg-transparent group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-8 shadow-none md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:p-0 lg:shadow-none">
              <div className="lg:hidden w-full">
                <ul className="space-y-6 text-base font-light tracking-wide text-white/80">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className="hover:text-white block duration-200 transition-colors w-full text-left py-1"
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:block hidden">
                {/* Desktop CTA only - Hidden on mobile menu to avoid duplication urgency */}
                <Button
                  onClick={() => {
                    setMenuState(false);
                    onJoinWaitlist?.();
                  }}
                  className="rounded-full px-6"
                  variant="hero"
                >
                  Request Access
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};
