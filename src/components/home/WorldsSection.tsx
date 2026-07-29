import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

/**
 * Section 2 — the four public Swissperiences worlds.
 * Deliberately composed as a magazine contents page: numbered editorial rows
 * with hairline rules, not a feature-card grid.
 */
const worlds = [
  { key: "stay", to: "/sanctuaries", image: "/images/_preview/loft-fireplace-evening.jpeg", alt: "The Sanctuary loft fireplace at evening, Villars-sur-Ollon" },
  { key: "experience", to: "/experiences", image: "/images/_preview/cinematic-alpine-road.jpeg", alt: "An alpine road curving through the Swiss mountains" },
  { key: "listen", to: "/audio", image: "/images/_preview/geneva-jet-deau-aerial.jpg", alt: "Geneva and the Jet d'Eau from above — where Stones & Water begins" },
  { key: "remember", to: "/journals", image: "/images/guests/leo/3.jpeg", alt: "Lauterbrunnen valley in autumn, from a guest journal" },
] as const;

export default function WorldsSection() {
  const { t } = useTranslation("home");

  return (
    <section id="worlds" className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#060606] scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variant="fade">
          <SectionEyebrow className="mb-6">{t("worlds.eyebrow")}</SectionEyebrow>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/85 leading-[1.05] mb-4 max-w-2xl">
            {t("worlds.heading")}
          </h2>
          <p className="text-white/50 text-base md:text-lg font-light max-w-xl mb-16 md:mb-20">
            {t("worlds.support")}
          </p>
        </ScrollReveal>

        <div className="border-t border-white/10">
          {worlds.map((world, i) => (
            <ScrollReveal key={world.key} variant="fade" delay={i * 0.08}>
              <Link
                to={world.to}
                className="group grid grid-cols-12 gap-x-4 md:gap-x-8 items-center py-8 md:py-10 border-b border-white/10 hover:border-white/25 transition-colors duration-500"
              >
                {/* Index + label */}
                <div className="col-span-12 md:col-span-2 flex md:block items-baseline gap-4 mb-3 md:mb-0">
                  <span className="font-serif text-white/25 text-lg md:text-xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="block text-[11px] uppercase tracking-[0.3em] text-white/45 md:mt-2 group-hover:text-glacier-300 transition-colors duration-500">
                    {t(`worlds.${world.key}.label`)}
                  </span>
                </div>

                {/* Name */}
                <h3 className="col-span-12 md:col-span-4 font-serif text-2xl md:text-3xl lg:text-4xl text-white/80 leading-tight group-hover:text-white transition-colors duration-500 mb-3 md:mb-0">
                  {t(`worlds.${world.key}.name`)}
                </h3>

                {/* Description */}
                <p className="col-span-12 md:col-span-4 text-white/50 text-sm md:text-base font-light leading-relaxed mb-4 md:mb-0">
                  {t(`worlds.${world.key}.description`)}
                </p>

                {/* Image */}
                <div className="col-span-12 md:col-span-2">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={world.image}
                      alt={world.alt}
                      loading="lazy"
                      className="w-full h-full object-cover brightness-[0.75] saturate-[0.85] group-hover:brightness-90 group-hover:scale-[1.04] transition-all duration-700"
                    />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
