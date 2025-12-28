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

interface NavigationProps {
  onWaitlistClick: () => void;
}

const navLinks = [
  { label: "Experiences", href: "#experiences" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Teams", href: "/for-teams" },
];

export default function Navigation({ onWaitlistClick }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    if (location.pathname !== "/") {
      navigate("/");
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
            <div className="relative flex items-center justify-between gap-6 lg:gap-0">
            {/* Logo + Mobile Button + Desktop Nav Links */}
            <div className="flex items-center justify-between lg:w-auto lg:gap-16">
              <Link
                to="/"
                className="text-lg text-white hover:text-white/80 transition-colors uppercase tracking-[0.2em]"
              >
                Swissperiences
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm font-medium">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <button
                        onClick={() => handleNavClick(link.href)}
                        className="block duration-150 transition-colors text-white/80 hover:text-white"
                      >
                        <span>{link.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Desktop CTA */}
            <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-8">
              {/* Invisible spacer */}
              <div className="hidden lg:block h-6 w-px opacity-0"></div>
              <button
                onClick={onWaitlistClick}
                className="group text-sm text-white/90 hover:text-white transition-colors uppercase tracking-[0.15em]"
                aria-label="Reserve your spot on the waitlist"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">Reserve Your Spot</span>
              </button>
            </div>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-[#1A1614]/95 backdrop-blur-md border border-white/10 rounded-2xl md:hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-lg text-white/80 hover:text-white transition-colors py-2"
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onWaitlistClick();
                }}
                className="group w-full mt-4 text-sm text-white/90 hover:text-white transition-colors text-center uppercase tracking-[0.15em]"
                aria-label="Reserve your spot on the waitlist"
              >
                <span className="border-b border-white/40 group-hover:border-white pb-1">Reserve Your Spot</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
