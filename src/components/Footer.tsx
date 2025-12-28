import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black border-t border-white/10 py-16 sm:py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src="/hero-video-v2.mp4" type="video/mp4" />
        </video>
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo & Tagline */}
          <h2 className="text-2xl font-semibold text-white mb-2">
            Swissperiences
          </h2>
          <p className="text-sm text-white/60 italic mb-3">
            A pause — designed.
          </p>
          <p className="text-xs text-white/40 mb-8">
            Created by people who've lived between Rio, Lisbon, and the Swiss Alps.
          </p>

          {/* Contact */}
          <a
            href="mailto:hello@swissperiences.ch"
            className="text-sm text-white/70 hover:text-white transition-colors mb-6"
          >
            hello@swissperiences.ch
          </a>

          {/* Social Links */}
          <div className="flex gap-6 mb-10">
            <a
              href="https://instagram.com/swissperiences"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              aria-label="Follow us on Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/company/swissperiences"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black rounded-sm"
              aria-label="Connect with us on LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 mb-8" />

          {/* Bottom Row */}
          <div className="flex flex-col items-center gap-3 text-xs text-white/40">
            <span>© 2024–2026 Swissperiences. All rights reserved.</span>
            <div className="flex gap-4 text-[10px] text-white/30">
              <a href="/privacy" className="hover:text-white/50 transition-colors focus:outline-none focus:underline">
                Privacy
              </a>
              <span className="text-white/20">·</span>
              <a href="/terms" className="hover:text-white/50 transition-colors focus:outline-none focus:underline">
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
