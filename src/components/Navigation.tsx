import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  onWaitlistClick: () => void;
}

const navLinks = [
  { label: "Experiences", href: "#experiences" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "For Teams", href: "#corporate-retreats" },
];

export default function Navigation({ onWaitlistClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4"
      >
        <nav
          className={`flex items-center justify-between gap-6 px-6 py-3 rounded-full transition-all duration-300 max-w-fit ${
            isScrolled
              ? "bg-black/80 backdrop-blur-md border border-white/10 shadow-lg"
              : "bg-black/40 backdrop-blur-sm border border-white/5"
          }`}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="text-lg font-semibold text-white hover:text-white/80 transition-colors tracking-tight"
          >
            Swissperiences
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-white/70 hover:text-white transition-colors focus:outline-none focus:text-white relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
                aria-label={`Navigate to ${link.label} section`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={onWaitlistClick}
              className="text-sm px-5 py-2 bg-white text-black rounded-full font-medium hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Reserve your spot on the waitlist"
            >
              Reserve Your Spot
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-40 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl md:hidden"
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
                className="w-full mt-4 text-base px-5 py-3 bg-white text-black rounded-full font-medium hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Reserve your spot on the waitlist"
              >
                Reserve Your Spot
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
