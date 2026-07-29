import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

interface FlagshipSanctuaryProps {
  onPlanStay: () => void;
}

/**
 * Section 3 — the flagship Sanctuary in Villars-sur-Ollon.
 * "The art of doing nothing, beautifully." lives here now, as the campaign
 * line of the Villars sanctuary — no longer carrying the whole umbrella brand.
 * Reuses the original "Above the clouds" full-bleed treatment.
 */
export default function FlagshipSanctuary({ onPlanStay }: FlagshipSanctuaryProps) {
  const { t } = useTranslation("home");

  return (
    <section className="bg-[#060606]">
      {/* Brand statement — the bridge from the worlds into the flagship */}
      <ScrollReveal variant="fade">
        <div className="py-16 md:py-24 px-8 md:px-16 lg:px-24">
          <p className="max-w-5xl mx-auto font-serif text-3xl md:text-5xl lg:text-6xl text-white/80 leading-[1.1] tracking-tight">
            {t("flagship.statement1")}
            <span className="text-white/40 italic"> {t("flagship.statement2")}</span>
          </p>
        </div>
      </ScrollReveal>

      {/* Full-bleed flagship */}
      <ScrollReveal variant="fade">
        <div className="relative h-[80vh] md:h-screen overflow-hidden">
          <img
            src="/images/_preview/sea-of-clouds-hero.jpeg"
            srcSet="/images/_preview/sea-of-clouds-hero.jpeg 800w, /images/villars/sea-of-clouds-hero.jpeg 5504w"
            sizes="100vw"
            alt="Sea of clouds at sunset from Villars — Dents du Midi at 1,300m"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          <div className="absolute inset-0 flex items-end md:items-center px-8 md:px-16 lg:px-24 pb-16 md:pb-0">
            <div className="max-w-xl">
              <SectionEyebrow className="mb-6">{t("flagship.eyebrow")}</SectionEyebrow>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[0.95] mb-6">
                {t("flagship.title1")}
                <span className="block italic text-white/60">{t("flagship.title2")}</span>
              </h2>
              <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-4 max-w-sm">
                {t("flagship.support")}
              </p>
              <p className="text-white/45 text-sm mb-10">
                {t("flagship.note")}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link
                  to="/sanctuaries/villars"
                  className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/70 hover:text-glacier-300 transition-colors border-b border-white/30 hover:border-glacier-500/40"
                >
                  {t("flagship.cta")}
                </Link>
                <button
                  onClick={onPlanStay}
                  className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-glacier-300 transition-colors border-b border-white/20 hover:border-glacier-500/40"
                >
                  {t("flagship.secondaryCta")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
