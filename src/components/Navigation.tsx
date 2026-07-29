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
import { useAuth } from '@/hooks/use-auth';

interface NavigationProps {
  onWaitlistClick?: () => void; // deprecated — kept for backward compat, no longer used
}

const navLinksConfig = [
  { key: "stay", href: "/sanctuaries" },
  { key: "experiences", href: "/experiences" },
  { key: "audio", href: "/audio" },
  { key: "journals", href: "/journals" },
  { key: "about", href: "/about" },
];

/** Strips an /en or /pt prefix so active states survive language-prefixed routes. */
function stripLangPrefix(pathname: string): string {
  return pathname.replace(/^\/(en|pt)(?=\/|$)/, "") || "/";
}

export default function Navigation({ onWaitlistClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('common');
  const { isLoggedIn } = useAuth();

  // Generate nav links with translations — all are now path-based
  const navLinks = navLinksConfig.map(item => ({
    label: t(`nav.${item.key}`, item.key.charAt(0).toUpperCase() + item.key.slice(1)),
    href: item.href,
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
    navigate(href);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <header>
        <motion.nav
          className="fixed top-[calc(1.5rem+env(safe-area-inset-top,0px))] inset-x-0 z-40 flex justify-center pointer-events-none"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Compact Luxury Pill */}
          <motion.div
            animate={{
              backgroundColor: scrolled ? 'rgba(20, 20, 20, 0.4)' : 'rgba(20, 20, 20, 0.2)',
              borderColor: scrolled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
              backdropFilter: scrolled ? 'blur(16px)' : 'blur(8px)',
            }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-4 md:gap-8 py-2 px-6 md:px-8 rounded-full border shadow-[0_8px_32px_rgba(0,0,0,0.12)] pointer-events-auto mx-4 min-h-[44px]"
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
              <ul className="flex gap-6 text-[11px] font-bold uppercase tracking-[0.2em]">
                {navLinks.map((link) => {
                  const path = stripLangPrefix(location.pathname);
                  const isActive = path === link.href || path.startsWith(`${link.href}/`);
                  return (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className={cn(
                          "group relative block py-2 duration-700 ease-swiss-luxury transition-all whitespace-nowrap",
                          isActive ? "text-white" : "text-white/50 hover:text-white"
                        )}
                      >
                        <span className="relative z-10">{link.label}</span>
                        <div className={cn(
                          "absolute -bottom-1 left-0 h-px bg-white/40 transition-all duration-700 ease-swiss-luxury",
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
              {isLoggedIn ? (
                <Button
                  onClick={() => navigate('/members')}
                  className="rounded-full px-5 py-1.5 h-9 font-medium tracking-[0.15em] uppercase text-[10px] text-white/70 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-500"
                  variant="ghost"
                >
                  {t('nav.mySwissperiences', 'My Swissperiences')}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/login')}
                  className="rounded-full px-5 py-1.5 h-9 font-medium tracking-[0.2em] uppercase text-[10px] text-white/70 border border-white/15 bg-white/5 hover:bg-white hover:text-black transition-all duration-500"
                  variant="ghost"
                >
                  {t('nav.signIn', 'Sign In')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button - 44px Tap Target */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-11 h-11 flex items-center justify-center text-white hover:bg-white/5 rounded-full transition-all duration-700 ease-swiss-luxury"
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
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-4 top-[calc(5.5rem+env(safe-area-inset-top,0px))] z-40 bg-[#1A1614]/98 backdrop-blur-xl border border-white/10 rounded-3xl md:hidden shadow-2xl overflow-hidden"
          >
            <div className="px-8 pt-8 pb-[calc(2rem+env(safe-area-inset-bottom,0px))] space-y-5">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => {
                    handleNavClick(link.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-base font-light tracking-wide text-white/70 hover:text-white transition-colors duration-300 py-1.5"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile: Language Switcher */}
              <div className="pt-6 mt-8 border-t border-white/10 flex justify-center">
                <LanguageSwitcher />
              </div>

              {/* Mobile: CTA Button with Glassmorphism */}
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/members');
                  }}
                  className="rounded-full w-full mt-7 font-light tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                  variant="ghost"
                >
                  {t('nav.mySwissperiences', 'My Swissperiences')}
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="rounded-full w-full mt-7 font-light tracking-widest bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                  variant="ghost"
                >
                  {t('nav.signIn', 'Sign In')}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
