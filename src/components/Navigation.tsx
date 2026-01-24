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
import { cn } from "@/lib/utils";

interface NavigationProps {
  onWaitlistClick: () => void;
}

const navLinksConfig = [
  { key: "experiences", href: "#experiences" },
  { key: "calendar", href: "#upcoming-retreats" },
  { key: "journals", href: "/journals" },
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
          className="fixed top-6 inset-x-0 z-40 flex justify-center pointer-events-none p-safe-top"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Compact Luxury Pill */}
          <motion.div
            animate={{
              backgroundColor: scrolled ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.7)',
            }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4 md:gap-8 py-2 px-6 md:px-8 rounded-full border border-white/10 backdrop-blur-2xl shadow-2xl pointer-events-auto mx-4 min-h-[44px]"
          >
            {/* Logo */}
            <Link
              to="/"
              className="font-light text-white hover:opacity-80 transition-opacity uppercase tracking-[0.25em] text-xs md:text-sm shrink-0 flex items-center h-10"
            >
              Swissperiences
            </Link>

            {/* Desktop Navigation Links - More Compact & Active State Support */}
            <div className="hidden lg:block border-l border-white/10 pl-8">
              <ul className="flex gap-6 text-[9px] font-bold uppercase tracking-[0.2em]">
                {navLinks.map((link) => {
                  const isActive = location.hash === link.href ||
                    (location.pathname === link.href) ||
                    (link.href.includes('#') && location.hash === link.href.split('#')[1]);
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className={cn(
                          "group relative block py-2 duration-500 transition-all whitespace-nowrap",
                          isActive ? "text-white" : "text-white/40 hover:text-white"
                        )}
                      >
                        <span className="relative z-10">{link.label}</span>
                        <div className={cn(
                          "absolute -bottom-1 left-0 h-px bg-white/40 transition-all duration-500",
                          isActive ? "w-full bg-white" : "w-0 group-hover:w-full"
                        )} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support Actions */}
            <div className="hidden lg:flex items-center gap-6 shrink-0 border-l border-white/10 pl-6 h-full">
              <LanguageSwitcher />
              <Button
                onClick={onWaitlistClick}
                className="rounded-full px-5 py-1.5 h-9 font-bold tracking-[0.2em] uppercase text-[9px] border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-500"
                variant="ghost"
              >
                Inquire
              </Button>
            </div>

            {/* Mobile Menu Button - 44px Tap Target */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white hover:bg-white/5 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
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
                Check Availability
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
