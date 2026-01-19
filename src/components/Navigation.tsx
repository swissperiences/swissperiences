/**
 * Standalone Navigation Component
 *
 * NOTE: This component is similar to HeroHeader in hero-section.tsx
 * TODO: Consider consolidating both into a single shared navigation component
 *
 * Current usage:
 * - ForTeams page (standalone header without hero)
 * - HeroHeader is used in Index page (integrated with hero section)
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/i18n/LanguageSwitcher';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  onWaitlistClick: () => void;
}

const navLinksConfig = [
  { key: "experiences", href: "#experiences" },
  { key: "howItWorks", href: "#how-it-works" },
  { key: "forTeams", href: "/for-teams" },
];

export default function Navigation({ onWaitlistClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('common');

  // Generate nav links with translations
  const navLinks = navLinksConfig.map(item => ({
    label: t(`nav.${item.key}`),
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
    setIsMobileMenuOpen(false);

    // Handle path navigation
    if (href.startsWith("/")) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }

    // Handle hash navigation from other pages
    const currentLangPath = `/${i18n.language}`;
    if (location.pathname !== currentLangPath && location.pathname !== '/') {
      navigate(currentLangPath);
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }

    // Handle hash navigation on home page
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header>
        <motion.nav
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
            <div className="relative flex flex-wrap items-center justify-between gap-6 lg:flex-nowrap lg:gap-0">
            {/* Logo + Mobile Button + Desktop Nav Links */}
            <div className="flex w-full items-center justify-between lg:w-auto lg:gap-16">
              <Link
                to="/"
                className="text-lg font-light text-white hover:opacity-80 transition-opacity uppercase tracking-[0.3em]"
              >
                Swissperiences
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 text-white hover:bg-white/5 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:block">
                <ul className="flex gap-10 text-sm font-light tracking-wide">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="group relative block duration-300 transition-all text-white/70 hover:text-white whitespace-nowrap"
                      >
                        <span>{link.label}</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white/60 transition-all duration-300 group-hover:w-full group-hover:bg-white" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desktop: Language Switcher + CTA */}
            <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-6 lg:flex-shrink-0">
              <LanguageSwitcher />
              <Button
                onClick={onWaitlistClick}
                className="rounded-full px-8 py-2.5 font-light tracking-wide"
                variant="hero"
              >
                {t('buttons.reserveSpot')}
              </Button>
            </div>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-20 z-40 bg-[#1A1614]/98 backdrop-blur-xl border border-white/10 rounded-3xl md:hidden shadow-2xl"
          >
            <div className="px-8 py-8 space-y-5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-base font-light tracking-wide text-white/70 hover:text-white transition-colors duration-300 py-1.5"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile: Language Switcher */}
              <div className="pt-6 mt-8 border-t border-white/10 flex justify-center">
                <LanguageSwitcher />
              </div>

              {/* Mobile: CTA Button */}
              <Button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onWaitlistClick();
                }}
                className="rounded-full w-full mt-7 font-light tracking-wide"
                variant="hero"
              >
                {t('buttons.reserveSpot')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
