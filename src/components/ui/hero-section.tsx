'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useScroll, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onJoinWaitlist?: () => void;
}

export function HeroSection({ onJoinWaitlist }: HeroSectionProps) {
  const { scrollYProgress } = useScroll();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      // Map scroll progress to 0-1 range for the first screen
      const progress = Math.min(latest * 2, 1);
      setScrollProgress(progress);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Calculate transformations based on scroll
  const videoScale = 1.2 - scrollProgress * 0.2; // 1.2 -> 1.0
  const videoOpacity = 1 - scrollProgress * 0.3; // 1 -> 0.7

  // Text convergence: start separated, end centered
  const topTextY = -100 * (1 - scrollProgress); // -100 -> 0
  const topTextX = -50 * (1 - scrollProgress); // -50 -> 0
  const bottomTextY = 100 * (1 - scrollProgress); // 100 -> 0
  const bottomTextX = 50 * (1 - scrollProgress); // 50 -> 0

  const textOpacity = 0.3 + scrollProgress * 0.7; // 0.3 -> 1
  const ctaOpacity = scrollProgress; // 0 -> 1
  const ctaScale = 0.8 + scrollProgress * 0.2; // 0.8 -> 1

  return (
    <>
      <HeroHeader onJoinWaitlist={onJoinWaitlist} />
      <section className="relative w-full overflow-x-hidden">
        {/* Full-screen Video Background */}
        <motion.div
          className="fixed inset-0 z-0"
          style={{
            scale: videoScale,
            opacity: videoOpacity,
          }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          >
            <source src="/hero-video-v2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay: Lighter on mobile (bottom gradient only), Standard on desktop */}
          <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-b md:from-black/60 md:via-black/50 md:to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 md:hidden" />
        </motion.div>

        {/* --- MOBILE LAYOUT (One idea per viewport) --- */}
        <div className="relative z-10 flex flex-col md:hidden">

          {/* Viewport 1: The Hook - Pure & Simple */}
          <div className="flex h-[100dvh] w-full flex-col items-center justify-center px-6 text-center">
            {/* Note: Removed pre-header for absolute focus */}
            <h1 className="text-white font-medium tracking-tight leading-[1.15] drop-shadow-lg">
              <span className="block text-[2.5rem]">
                Switzerland
              </span>
              <span className="block text-[2.5rem]">
                is not a
              </span>
              <span className="block text-[2.5rem]">
                destination.
              </span>
            </h1>
          </div>

          {/* Viewport 2: The Resolution & Action */}
          <div className="flex min-h-[85vh] w-full flex-col items-center justify-center px-6 text-center pb-24 bg-gradient-to-b from-transparent to-black/40">
            <h1 className="text-white font-medium tracking-tight leading-[1.15] drop-shadow-lg mb-8">
              <span className="block text-[2.2rem] opacity-90">
                It&apos;s a state
              </span>
              <span className="block text-[2.2rem] opacity-90">
                of mind.
              </span>
            </h1>

            <p className="mx-auto text-sm text-white/55 font-light leading-relaxed">
              Curated Swiss experiences.
            </p>

            <div className="mt-10 flex justify-center">
              <button
                onClick={onJoinWaitlist}
                className="rounded-full bg-white/95 px-10 py-4 text-sm font-medium text-black hover:bg-white transition-colors shadow-xl"
              >
                Request Access
              </button>
            </div>
          </div>
        </div>

        {/* --- DESKTOP LAYOUT (Preserved) --- */}
        <div className="relative z-10 hidden md:flex h-screen items-center justify-center px-6">
          <div className="mx-auto w-full max-w-6xl text-center lg:-translate-y-[8vh]">
            <div className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-white/70">
              Curated in Switzerland
            </div>

            {/* Headline (LOCKED) */}
            <h1 className="text-white font-medium tracking-tight leading-[1.06]" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.25)" }}>
              <span className="block text-[clamp(3.4rem,6.0vw,6.4rem)]">
                Switzerland is not a
              </span>
              <span className="block text-[clamp(3.4rem,6.0vw,6.4rem)]">
                destination.
              </span>
              <span className="block text-[clamp(3.4rem,6.0vw,6.4rem)]">
                It&apos;s a state of mind.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-2xl text-sm md:text-base text-white/60 font-light">
              Immersive nature. For those seeking less noise and more feeling.
            </p>
            <p className="mx-auto mt-2 max-w-2xl text-sm md:text-base text-white/60 font-light">
              Curated Swiss experiences — from intimate moments to immersive journeys.
            </p>

            {/* Micro-phrase (Lead-first, editorial, discreet) */}
            <p className="mx-auto mt-3 text-xs text-white/50 font-light tracking-wide">
              Inquiries limited. Curated individually.
            </p>

            {/* CTA */}
            <div className="mt-[12vh] flex justify-center">
              <button
                onClick={onJoinWaitlist}
                className="rounded-full bg-white/90 px-8 py-3 text-sm font-medium text-black hover:bg-white/100 transition-colors"
              >
                Request Access
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

const HeroHeader = ({ onJoinWaitlist }: { onJoinWaitlist?: () => void }) => {
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

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
        className="group fixed z-50 w-full pt-4 px-4"
      >
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-full px-6 transition-all duration-300',
            scrolled || menuState ? 'bg-background/95 backdrop-blur-md border border-white/10 shadow-lg' : 'bg-white/5 backdrop-blur-sm border border-white/10'
          )}
        >
          <motion.div
            className={cn(
              'relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0',
              scrolled ? 'lg:py-3' : 'lg:py-4'
            )}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={cn(
                  "flex items-center space-x-2 font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity",
                  scrolled ? "text-foreground" : "text-white"
                )}
                aria-label="home"
              >
                Swissperiences
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-50 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className={cn(
                  "group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200",
                  scrolled ? "text-foreground" : "text-white"
                )} />
                <X className={cn(
                  "group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200",
                  scrolled ? "text-foreground" : "text-white"
                )} />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleNavClick(item.href)}
                        className={cn(
                          "block duration-150 transition-colors",
                          scrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
                        )}
                      >
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-black/50 backdrop-blur-xl lg:bg-transparent group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-white/10 p-8 shadow-none md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:p-0 lg:shadow-none">
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
