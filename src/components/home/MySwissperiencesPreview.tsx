import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

/**
 * Section 7 — the public preview of My Swissperiences.
 * Styled as a host's prepared note, not a dashboard: membership shown as a
 * benefit rather than a gate. The list mirrors what the private layer
 * connects; no fake data, no fake screenshots.
 */
const ITEM_KEYS = [
  "itinerary",
  "arrival",
  "concierge",
  "experiences",
  "audio",
  "profile",
  "memories",
] as const;

export default function MySwissperiencesPreview() {
  const { t } = useTranslation("home");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Copy */}
        <div className="md:col-span-6">
          <ScrollReveal variant="fade">
            <SectionEyebrow className="mb-6">{t("myswissperiences.eyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/85 leading-[1.05] mb-6">
              {t("myswissperiences.heading")}
            </h2>
            <p className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-md mb-10">
              {t("myswissperiences.support")}
            </p>
            <button
              onClick={() => navigate(isLoggedIn ? "/members" : "/login")}
              className="px-10 py-4 bg-white text-black text-xs uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300"
            >
              {t("myswissperiences.cta")}
            </button>
          </ScrollReveal>
        </div>

        {/* The prepared note */}
        <div className="md:col-span-5 md:col-start-8">
          <ScrollReveal variant="fade" delay={0.15}>
            <div className="border border-white/10 bg-[#060606] px-8 py-10 md:px-10 md:py-12">
              <ul className="space-y-0">
                {ITEM_KEYS.map((key, i) => (
                  <li
                    key={key}
                    className={`flex items-baseline gap-4 py-3.5 ${i > 0 ? "border-t border-white/5" : ""}`}
                  >
                    <span className="font-serif text-white/25 text-sm select-none" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/65 text-sm md:text-base font-light">
                      {t(`myswissperiences.items.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
