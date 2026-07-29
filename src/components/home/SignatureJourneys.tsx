import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSignatureJourneys, getSeasonBadge } from "@/lib/packageStatus";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

/** Maps full-size image paths to 800px preview versions for display */
function getPreviewSrc(src: string): string | null {
  const basename = src.split("/").pop();
  if (!basename) return null;
  const previews = new Set([
    "alpine-reset-lake.jpeg", "winter-escape-ski-sunset.jpeg",
    "cinematic-alpine-road.jpeg", "loft-fireplace-night.jpeg",
    "loft-fireplace-evening.jpeg", "lavaux-vineyards-sunset.jpeg",
    "sea-of-clouds-sunset.jpeg", "dawn-fog-chalets.jpeg",
    "villars-autumn-sunset.jpg", "sunset-golden.jpeg",
  ]);
  return previews.has(basename) ? `/images/_preview/${basename}` : null;
}

interface SignatureJourneysProps {
  onRequestJourney: (packageId: string) => void;
}

/**
 * Section 4 — exactly three signature journeys, chosen by the date-aware
 * selector so an expired event can never headline the homepage. Editorial
 * alternating rows, not a card grid; the full inventory stays on /packages.
 */
export default function SignatureJourneys({ onRequestJourney }: SignatureJourneysProps) {
  const { t } = useTranslation("home");
  const journeys = getSignatureJourneys(3);

  return (
    <section id="journeys" className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#060606] border-t border-white/5 scroll-mt-16">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variant="fade">
          <div className="mb-16 md:mb-24 max-w-2xl">
            <SectionEyebrow className="mb-6">{t("journeys.eyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-4xl md:text-5xl text-white/85 leading-[1.05] mb-4">
              {t("journeys.heading")}
            </h2>
            <p className="text-white/50 text-base md:text-lg font-light">
              {t("journeys.support")}
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-20 md:space-y-28">
          {journeys.map((pkg, i) => {
            const badge = getSeasonBadge(pkg);
            const preview = getPreviewSrc(pkg.image);
            return (
              <ScrollReveal key={pkg.id} variant="fade">
                <article className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
                  {/* Image */}
                  <div className={`md:col-span-7 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={preview || pkg.image}
                        srcSet={preview ? `${preview} 800w, ${pkg.image} 2000w` : undefined}
                        sizes="(max-width: 768px) 100vw, 58vw"
                        alt={`${pkg.name} — ${pkg.tagline}`}
                        loading="lazy"
                        className={`w-full h-full object-cover brightness-[0.65] ${pkg.imagePosition || ""}`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                      <span className="absolute bottom-5 left-6 font-serif text-white/30 text-5xl md:text-6xl leading-none select-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className={`md:col-span-5 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 text-[11px] uppercase tracking-[0.25em]">
                      <span className="text-white/45">{pkg.duration}</span>
                      <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                      <span className={badge.active ? "text-glacier-300/80" : "text-white/40"}>
                        {badge.label}
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-white/85 leading-tight mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-white/50 italic font-light text-base mb-6">
                      {pkg.tagline}
                    </p>

                    <ul className="space-y-2.5 mb-8">
                      {pkg.previewIncludes.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="w-1 h-1 mt-2 bg-white/25 rounded-full shrink-0" aria-hidden="true" />
                          <span className="text-white/55 text-sm md:text-base font-light">{item}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => onRequestJourney(pkg.id)}
                      className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/60 hover:text-glacier-300 transition-colors border-b border-white/25 hover:border-glacier-500/40"
                    >
                      {t("journeys.itemCta")}
                    </button>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal variant="fade">
          <div className="text-center mt-16 md:mt-24">
            <Link
              to="/packages"
              className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-white/80 transition-colors border-b border-white/20 hover:border-glacier-500/40"
            >
              {t("journeys.cta")}
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
