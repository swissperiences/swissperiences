/**
 * Unified Navigation Component
 *
 * Consolidated navigation used across all pages:
 * - Index page (with hero section)
 * - ForTeams page (standalone)
 * - All other pages
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
  { key: "calendar", href: "#upcoming-retreats" },
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
            maxWidth: scrolled ? 'fit-content' : '1400px',
          }}
          transition={{
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Pieces-style materializing pill background */}
          <motion.div
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{
              opacity: scrolled ? 1 : 0.3,
              scale: scrolled ? 1 : 1,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1], // Pieces.app easing curve
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[20px] border border-white/10 rounded-full shadow-2xl"
            style={{ pointerEvents: 'none' }}
          />

          <motion.div
            className="relative rounded-full text-white"
            animate={{
              paddingLeft: scrolled ? '32px' : '32px',
              paddingRight: scrolled ? '32px' : '32px',
              paddingTop: scrolled ? '8px' : '14px',
              paddingBottom: scrolled ? '8px' : '14px',
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="relative flex flex-wrap items-center justify-between gap-6 lg:flex-nowrap lg:gap-10">
              {/* Logo + Mobile Button + Desktop Nav Links */}
              <div className="flex w-full items-center justify-between lg:w-auto lg:gap-20">
                <motion.div
                  animate={{
                    fontSize: scrolled ? '0.9rem' : '1.05rem',
                    letterSpacing: scrolled ? '0.15em' : '0.2em',
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to="/"
                    className="font-light text-white hover:opacity-80 transition-opacity uppercase tracking-[0.2em]"
                  >
                    Swissperiences
                  </Link>
                </motion.div>

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
                  <ul className="flex gap-14 text-[13px] font-light uppercase tracking-[0.15em]">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <button
                          onClick={() => handleNavClick(link.href)}
                          className="group relative block duration-500 transition-all text-white/60 hover:text-white whitespace-nowrap"
                        >
                          <span className="relative z-10">{link.label}</span>
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#D8B58A] transition-all duration-500 group-hover:w-full" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Desktop: Language Switcher + CTA */}
              <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-12 lg:flex-shrink-0">
                <LanguageSwitcher />
                <motion.div
                  animate={{
                    opacity: scrolled ? 0.95 : 1,
                    scale: scrolled ? 0.95 : 1,
                  }}
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Button
                    onClick={onWaitlistClick}
                    className="rounded-0 px-8 py-6 font-light tracking-[0.1em] uppercase text-xs border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all duration-500 backdrop-blur-sm"
                    variant="ghost"
                    style={{ borderRadius: '2px' }}
                  >
                    {t('common:nav.requestAccess')}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
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
                {t('common:nav.requestAccess')}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
