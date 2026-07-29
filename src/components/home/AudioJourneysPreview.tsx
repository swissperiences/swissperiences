import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

/**
 * Section 5 — Audio Journeys preview for `Stones & Water`.
 * A product preview only: a static route visual with chapter markers, no fake
 * playback and no purchase claim. Facts limited to the confirmed set —
 * Geneva Old Town, 7 chapters, 1.9 km, ~60 min, begins at Jardin Anglais.
 */
const CHAPTER_COUNT = 7;

export default function AudioJourneysPreview() {
  const { t } = useTranslation("home");

  const stats = [
    t("listen.location"),
    t("listen.chapters"),
    t("listen.distance"),
    t("listen.durationValue"),
  ];

  return (
    <section id="listen" className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#0a0a0a] border-t border-white/5 scroll-mt-16">
      <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Copy */}
        <div className="md:col-span-6">
          <ScrollReveal variant="fade">
            <SectionEyebrow className="mb-6">{t("listen.eyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/85 leading-[1.05] mb-6">
              {t("listen.heading")}
            </h2>
            <p className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-md mb-8">
              {t("listen.support")}
            </p>

            <ul className="flex flex-wrap gap-x-6 gap-y-3 mb-8">
              {stats.map((stat) => (
                <li key={stat} className="text-[11px] uppercase tracking-[0.25em] text-white/45 border border-white/10 px-3 py-1.5">
                  {stat}
                </li>
              ))}
            </ul>

            <p className="text-white/40 text-sm font-light italic mb-10">
              {t("listen.status")}
            </p>

            <Link
              to="/audio"
              className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/60 hover:text-glacier-300 transition-colors border-b border-white/25 hover:border-glacier-500/40"
            >
              {t("listen.cta")}
            </Link>
          </ScrollReveal>
        </div>

        {/* Route visual — restrained line with chapter markers */}
        <div className="md:col-span-6">
          <ScrollReveal variant="fade" delay={0.15}>
            <div className="relative overflow-hidden aspect-[4/5] md:aspect-[3/4] max-w-md mx-auto">
              <img
                src="/images/_preview/geneva-jet-deau-aerial.jpg"
                srcSet="/images/_preview/geneva-jet-deau-aerial.jpg 800w, /images/drone/geneva-jet-deau-aerial.jpg 2000w"
                sizes="(max-width: 768px) 100vw, 40vw"
                alt="Geneva from above — the Jet d'Eau and the Old Town, where Stones & Water walks"
                loading="lazy"
                className="w-full h-full object-cover brightness-[0.5] saturate-[0.8]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

              {/* Route line */}
              <svg
                viewBox="0 0 100 140"
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
                preserveAspectRatio="xMidYMid meet"
              >
                <path
                  d="M 24 122 C 30 104, 52 108, 58 92 C 64 76, 44 68, 48 52 C 52 36, 70 34, 72 20"
                  fill="none"
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="0.6"
                  strokeDasharray="2 2"
                />
                {[
                  [24, 122], [38, 106], [56, 94], [58, 74], [47, 58], [52, 40], [72, 20],
                ].map(([x, y], i) => (
                  <g key={i}>
                    <circle cx={x} cy={y} r="1.6" fill="rgba(255,255,255,0.85)" />
                    <circle cx={x} cy={y} r="3.4" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
                  </g>
                ))}
              </svg>

              {/* Start + end annotations */}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
                <div>
                  <span className="block text-[11px] uppercase tracking-[0.25em] text-white/60 mb-1">01</span>
                  <span className="block text-white/85 font-serif italic text-lg leading-tight">
                    Jardin Anglais
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[11px] uppercase tracking-[0.25em] text-white/60 mb-1">
                    {String(CHAPTER_COUNT).padStart(2, "0")}
                  </span>
                  <span className="block text-white/70 font-serif italic text-lg leading-tight">
                    {t("listen.location")}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
