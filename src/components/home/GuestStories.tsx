import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { journals } from "@/data/journals";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import SectionEyebrow from "./SectionEyebrow";

/**
 * Section 6 — guest stories. One featured Journal plus two supporting quotes,
 * replacing the old full-length quote carousel + separate Journal feature
 * (two sections, ~1,800px) with a single editorial block. All quotes, names
 * and dates come from src/data/journals.ts — real guests only.
 */
const FEATURED_SLUG = "the-winter-ascent";

export default function GuestStories() {
  const { t } = useTranslation("home");

  const featured = journals.find((j) => j.slug === FEATURED_SLUG) ?? journals[0];
  const supporting = journals.filter((j) => j.slug !== featured.slug).slice(0, 2);

  return (
    <section className="py-24 md:py-36 px-8 md:px-16 lg:px-24 bg-[#060606] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal variant="fade">
          <SectionEyebrow className="mb-6">{t("stories.eyebrow")}</SectionEyebrow>
          <h2 className="font-serif text-4xl md:text-5xl text-white/85 leading-[1.05] mb-14 md:mb-20">
            {t("stories.heading")}
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-12 gap-10 md:gap-16">
          {/* Featured story */}
          <ScrollReveal variant="fade" className="md:col-span-6">
            <Link to={`/journals/${featured.slug}`} className="group block">
              <div className="aspect-[3/4] relative overflow-hidden mb-6">
                <img
                  src={featured.coverImage}
                  alt={`${featured.guests} — ${featured.title}`}
                  className={`w-full h-full object-cover ${featured.coverPosition || ""} group-hover:scale-[1.03] transition-transform duration-[1200ms]`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="font-serif text-3xl md:text-4xl text-white leading-[0.95] mb-2">
                    {featured.title}
                  </h3>
                  <p className="text-white/60 text-sm font-light">
                    {featured.guests} · {featured.date}
                  </p>
                </div>
              </div>
              <blockquote className="font-serif text-xl md:text-2xl text-white/65 italic leading-[1.4] mb-4">
                "{featured.quote}"
              </blockquote>
              <span className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/50 group-hover:text-glacier-300 transition-colors border-b border-white/20 group-hover:border-glacier-500/40">
                {t("stories.featuredCta")}
              </span>
            </Link>
          </ScrollReveal>

          {/* Supporting stories */}
          <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center gap-14 md:gap-20">
            {supporting.map((journal, i) => (
              <ScrollReveal key={journal.id} variant="fade" delay={0.1 + i * 0.1}>
                <Link to={`/journals/${journal.slug}`} className="group block">
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border border-white/10 group-hover:border-glacier-500/30 transition-colors shrink-0">
                      <img
                        src={journal.coverImage}
                        alt={journal.guests}
                        className={`w-full h-full object-cover ${journal.coverPosition || ""}`}
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <blockquote className="font-serif text-lg md:text-xl text-white/60 italic leading-[1.4] mb-3">
                        "{journal.quote}"
                      </blockquote>
                      <p className="text-white/45 text-sm">
                        {journal.guests} · {journal.date}
                      </p>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}

            <ScrollReveal variant="fade" delay={0.3}>
              <Link
                to="/journals"
                className="inline-block py-3 -my-3 text-xs uppercase tracking-[0.25em] text-white/50 hover:text-glacier-300 transition-colors border-b border-white/20 hover:border-glacier-500/40"
              >
                {t("stories.allCta")} →
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
