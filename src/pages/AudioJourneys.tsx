import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";
import SectionEyebrow from "@/components/home/SectionEyebrow";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useTranslation } from "react-i18next";

/**
 * LISTEN — Swissperiences Audio Journeys.
 * A product preview page for `Stones & Water`, the first proprietary journey.
 * Facts limited to the confirmed set: Geneva Old Town, 7 chapters, 1.9 km,
 * ~60 minutes, beginning at the Jardin Anglais. No playback, no purchase
 * claim — the journey is in production; the newsletter is the honest CTA.
 */
const CHAPTER_COUNT = 7;

export default function AudioJourneys() {
  const { t } = useTranslation("home");

  const stats = [
    { label: t("listen.location") },
    { label: t("listen.chapters") },
    { label: t("listen.distance") },
    { label: t("listen.durationValue") },
    { label: t("listen.start") },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO
        title="Audio Journeys — Stones & Water | Swissperiences"
        description="Swissperiences Audio Journeys: Switzerland, narrated as you walk it. The first journey — Stones & Water — walks Geneva's Old Town in seven chapters, from the Jardin Anglais."
        canonical="https://www.swissperiences.ch/audio"
      />
      <Navigation />

      {/* Hero */}
      <section className="relative pt-40 pb-24 md:pt-52 md:pb-32 px-8 md:px-16 lg:px-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/_preview/geneva-jet-deau-aerial.jpg"
            srcSet="/images/_preview/geneva-jet-deau-aerial.jpg 800w, /images/drone/geneva-jet-deau-aerial.jpg 2000w"
            sizes="100vw"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover brightness-[0.35] saturate-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[#060606]" />
        </div>

        <div className="relative z-10 max-w-4xl">
          <ScrollReveal variant="fade">
            <SectionEyebrow className="mb-6">{t("listen.eyebrow")}</SectionEyebrow>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-[0.95] mb-6">
              Stones &<br />Water.
            </h1>
            <p className="text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-8">
              {t("listen.support")}
            </p>
            <p className="text-white/45 text-sm font-light italic">
              {t("listen.status")}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Facts */}
      <section className="px-8 md:px-16 lg:px-24 pb-20 md:pb-28">
        <div className="max-w-4xl">
          <ScrollReveal variant="fade">
            <div className="flex flex-wrap gap-3">
              {stats.map((stat) => (
                <span
                  key={stat.label}
                  className="text-[11px] uppercase tracking-[0.25em] text-white/50 border border-white/10 px-4 py-2"
                >
                  {stat.label}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* The chapters — numbered, unnamed until release */}
      <section className="px-8 md:px-16 lg:px-24 pb-24 md:pb-36">
        <div className="max-w-4xl">
          <ScrollReveal variant="fade">
            <SectionEyebrow className="mb-10">{t("listen.page.walkEyebrow")}</SectionEyebrow>
          </ScrollReveal>
          <div className="border-t border-white/10">
            {Array.from({ length: CHAPTER_COUNT }, (_, i) => (
              <ScrollReveal key={i} variant="fade" delay={i * 0.05}>
                <div className="grid grid-cols-12 items-baseline gap-4 py-6 border-b border-white/10">
                  <span className="col-span-2 md:col-span-1 font-serif text-white/30 text-xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-10 md:col-span-7">
                    {i === 0 ? (
                      <span className="font-serif text-white/75 text-xl md:text-2xl italic">
                        Jardin Anglais
                      </span>
                    ) : i === CHAPTER_COUNT - 1 ? (
                      <span className="font-serif text-white/75 text-xl md:text-2xl italic">
                        {t("listen.location")}
                      </span>
                    ) : (
                      <span
                        className="inline-block h-px w-24 md:w-40 bg-white/15 align-middle"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {/* Decorative waveform fragment */}
                  <svg
                    viewBox="0 0 60 12"
                    className="hidden md:block col-span-4 h-3 w-full text-white/15"
                    aria-hidden="true"
                    preserveAspectRatio="none"
                  >
                    {Array.from({ length: 30 }, (_, b) => {
                      const h = 2 + ((b * 7 + i * 13) % 9);
                      return (
                        <rect key={b} x={b * 2} y={(12 - h) / 2} width="0.8" height={h} fill="currentColor" />
                      );
                    })}
                  </svg>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="text-white/35 text-sm font-light italic mt-8">
            {t("listen.page.chaptersNote")}
          </p>
        </div>
      </section>

      {/* Be the first to hear it */}
      <section className="py-24 md:py-32 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-xl mx-auto text-center">
          <ScrollReveal variant="fade">
            <SectionEyebrow className="mb-6">{t("listen.page.firstListenEyebrow")}</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-4xl text-white/85 mb-4">
              {t("listen.page.firstListenHeading")}
            </h2>
            <p className="text-white/45 text-base font-light mb-10">
              {t("listen.page.firstListenBody")}
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
