import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const PHONE = "41787002202";

/** Pages where the WhatsApp button appears, with context-aware messages */
const PAGE_MESSAGES: Record<string, string> = {
  "/": "Hi, I'd like to learn more about Swissperiences",
  "/packages": "Hi, I'm interested in your curated packages",
  "/experiences": "Hi, I'd like to know more about your experiences",
  "/experiences/road-journey": "Hi, I'm interested in the Alps Road Journey",
  "/experiences/cinematic-memories": "Hi, I'm interested in Cinematic Memories",
  "/experiences/private-chef": "Hi, I'm interested in the Private Chef experience",
  "/experiences/guided-hikes": "Hi, I'm interested in a Guided Alpine Hike",
  "/sanctuaries": "Hi, I'd like to know about your Alpine Sanctuaries",
  "/sanctuaries/villars": "Hi, I'm interested in The Villars Loft",
  "/for-teams": "Hi, I'm interested in a corporate retreat in Switzerland",
  "/discovery": "Hi, I'd like to know about your Discovery Packs",
  "/insider-guide": "Hi, I just downloaded the Insider Guide — tell me more",
  "/destinations": "Hi, I'm planning a trip to Switzerland",
};

/** Strip /:lang/ prefix to match route keys */
function normalizePath(pathname: string): string {
  return pathname.replace(/^\/(en|pt)/, "") || "/";
}

/** Check if current page should show the button (exact or prefix match for destinations) */
function getMessageForPath(pathname: string): string | null {
  const path = normalizePath(pathname);

  // Exact match first
  if (PAGE_MESSAGES[path]) return PAGE_MESSAGES[path];

  // Destination detail pages
  if (path.startsWith("/destinations/")) {
    const slug = path.split("/").pop()?.replace(/-/g, " ");
    const city = slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : "Switzerland";
    return `Hi, I'm interested in visiting ${city}`;
  }

  return null;
}

export default function WhatsAppButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const message = getMessageForPath(pathname);

  // Reset visibility on route change
  useEffect(() => {
    setVisible(false);
    setExpanded(false);
  }, [pathname]);

  // Show after small scroll (20vh instead of 50vh) with shorter delay
  useEffect(() => {
    if (!message) return;

    let timeout: ReturnType<typeof setTimeout>;
    let revealed = false;

    const handleScroll = () => {
      if (revealed) return;
      if (window.scrollY > window.innerHeight * 0.2) {
        revealed = true;
        timeout = setTimeout(() => setVisible(true), 200);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [message]);

  // Auto-expand label for 3s after appearing, then collapse
  useEffect(() => {
    if (!visible) return;
    setExpanded(true);
    const timer = setTimeout(() => setExpanded(false), 3000);
    return () => clearTimeout(timer);
  }, [visible]);

  // Don't render on non-revenue pages
  if (!message) return null;

  const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
  const showLabel = hovered || expanded;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`
        fixed bottom-8 right-8 z-50
        flex items-center gap-3
        rounded-full
        border
        backdrop-blur-xl
        transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
        group
        ${visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
        }
        ${showLabel
          ? "pl-5 pr-6 py-4 border-white/[0.10] bg-[#0E0D0C]/90 shadow-[0_4px_32px_rgba(46,144,144,0.10)]"
          : "p-4 border-white/[0.08] bg-[#0E0D0C]/85 shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        }
        hover:border-glacier-500/25
        hover:shadow-[0_4px_36px_rgba(46,144,144,0.15)]
      `}
    >
      {/* WhatsApp icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-[22px] h-[22px] shrink-0 transition-transform duration-700 ease-out group-hover:scale-110"
      >
        <path
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
          className="fill-white/50 group-hover:fill-[var(--ds-glacier-400)] transition-colors duration-500"
        />
        <path
          d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"
          className="fill-white/25 group-hover:fill-[var(--ds-glacier-500)]/50 transition-colors duration-500"
        />
      </svg>

      {/* Label — visible on hover AND auto-expands for 3s on first appear */}
      <span
        className={`
          text-xs uppercase tracking-[0.2em] font-medium whitespace-nowrap
          text-white/50 group-hover:text-white/70
          transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden
          ${showLabel ? "max-w-[140px] opacity-100" : "max-w-0 opacity-0"}
        `}
      >
        Message us
      </span>
    </a>
  );
}
