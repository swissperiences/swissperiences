/**
 * MembersExplore — Alpine Silence curated editorial page
 *
 * Full editorial experience with:
 * - Bento gallery layout (12-col CSS grid)
 * - Category filters (Type + Season)
 * - Destinations horizontal strip (cities.ts)
 * - Retreat spotlight (retreats.ts)
 * - Attributed testimonial (journals.ts)
 * - Guest stories section
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { packages } from "@/data/packages";
import { journals } from "@/data/journals";
import { cities } from "@/data/cities";
import { UPCOMING_RETREATS } from "@/data/retreats";
import { ArrowRight, Calendar, MapPin, MessageCircle } from "lucide-react";

// ── Filter helpers ──

type TypeFilter = "all" | "events" | "weekend" | "multi";
type SeasonFilter = "all" | "spring" | "summer" | "winter" | "year-round";

function getTypeTag(pkg: (typeof packages)[0]): TypeFilter {
  if (pkg.eventBadge) return "events";
  const d = pkg.duration.toLowerCase();
  if (d.includes("1 night") || d.includes("2 night")) return "weekend";
  return "multi";
}

function getSeasonTag(pkg: (typeof packages)[0]): SeasonFilter {
  const a = pkg.availability.toLowerCase();
  if (a.includes("year-round")) return "year-round";
  if (a.includes("december") || a.includes("march") || a.includes("winter")) return "winter";
  if (a.includes("april") || a.includes("may") || a.includes("june") || a.includes("spring")) return "spring";
  return "summer";
}

// ── Category labels for bento cards ──

const categoryLabels: Record<string, string> = {
  "jazz-alps": "Music & Culture",
  "tulip-trail": "Nature & Seasons",
  "lakeshore-alps": "Culture & Lakes",
  "alpine-reset": "Wellness",
  "cinematic-weekend": "Adventure",
  "alpine-bloom": "Nature & Seasons",
  "vineyard-valley": "Wine & Gastronomy",
  "grand-tour": "Signature",
  "spring-reset": "Minimalism",
  "winter-escape": "Winter & Snow",
};

function getWhatsAppUrl(pkg: (typeof packages)[0]): string {
  return `https://wa.me/41787002202?text=${encodeURIComponent(
    `Hi, I'd like to inquire about "${pkg.name}".`
  )}`;
}

export default function MembersExplore() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [seasonFilter, setSeasonFilter] = useState<SeasonFilter>("all");

  const filtered = packages.filter((pkg) => {
    if (typeFilter !== "all" && getTypeTag(pkg) !== typeFilter) return false;
    if (seasonFilter !== "all" && getSeasonTag(pkg) !== seasonFilter && getSeasonTag(pkg) !== "year-round") return false;
    return true;
  });

  const retreat = UPCOMING_RETREATS[0];
  const featuredJournal = journals[0];

  // Bento split: first 4 get special layout, rest go to regular grid
  const bentoHero = filtered[0];
  const bentoVertical = filtered[1];
  const bentoWide = filtered[2];
  const bentoSquareCta = filtered.length >= 4; // show CTA card if enough items
  const regularGrid = filtered.slice(3);

  // Destinations: pick 5 most relevant
  const destinations = cities.slice(0, 5);

  return (
    <MembersLayout>
      <SEO title="Curations | Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-6xl">
        {/* ── Hero header ── */}
        <section className="mb-12 sm:mb-16">
          <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4 font-[Manrope,sans-serif]">
            Personalized Curations
          </p>
          <h1 className="font-[Newsreader,serif] text-5xl sm:text-6xl lg:text-7xl text-white font-light leading-[1.05] mb-6">
            The Art of <em className="italic">Silence.</em>
          </h1>
          <p className="text-white/40 text-base sm:text-lg max-w-2xl leading-relaxed font-[Manrope,sans-serif]">
            A tailored selection of sanctuaries where time dissolves. Selected based on
            your preference for tranquility, architecture and alpine rhythms.
          </p>
        </section>

        {/* ── Filters ── */}
        <section className="mb-12 sm:mb-16 border-b border-[#1F1F1F] pb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6">
            <div className="flex flex-wrap gap-8 sm:gap-12">
              {/* Type filter */}
              <div>
                <span className="text-xs tracking-[0.25em] uppercase text-white/25 block mb-3 font-[Manrope,sans-serif]">
                  Type
                </span>
                <div className="flex gap-4 sm:gap-6">
                  {([
                    ["all", "All"],
                    ["events", "Events"],
                    ["weekend", "Weekend"],
                    ["multi", "Multi-day"],
                  ] as [TypeFilter, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setTypeFilter(key)}
                      className={`text-xs tracking-widest uppercase pb-1 transition-colors font-[Manrope,sans-serif] ${
                        typeFilter === key
                          ? "text-white border-b border-white"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season filter */}
              <div>
                <span className="text-xs tracking-[0.25em] uppercase text-white/25 block mb-3 font-[Manrope,sans-serif]">
                  Season
                </span>
                <div className="flex gap-4 sm:gap-6">
                  {([
                    ["all", "All"],
                    ["spring", "Spring"],
                    ["summer", "Summer"],
                    ["winter", "Winter"],
                  ] as [SeasonFilter, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => setSeasonFilter(key)}
                      className={`text-xs tracking-widest uppercase pb-1 transition-colors font-[Manrope,sans-serif] ${
                        seasonFilter === key
                          ? "text-white border-b border-white"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <span className="text-xs tracking-[0.2em] uppercase text-white/20 font-[Manrope,sans-serif]">
              {filtered.length} curations
            </span>
          </div>
        </section>

        {/* ── Bento gallery ── */}
        {filtered.length === 0 ? (
          <section className="mb-20 bg-[#1B1B1B] p-12 text-center">
            <h3 className="font-[Newsreader,serif] text-xl text-white mb-3">No curations match your filters.</h3>
            <p className="text-white/40 text-sm mb-6">Try broadening your selection.</p>
            <button
              onClick={() => { setTypeFilter("all"); setSeasonFilter("all"); }}
              className="text-xs tracking-widest uppercase text-white/50 hover:text-white transition-colors underline underline-offset-4 font-[Manrope,sans-serif]"
            >
              Clear filters
            </button>
          </section>
        ) : (
          <section className="mb-20">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Hero card — col-span-8, 16:9 */}
              {bentoHero && (
                <div className="md:col-span-8 group relative overflow-hidden bg-[#1B1B1B]">
                  <a href={getWhatsAppUrl(bentoHero)} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={bentoHero.image}
                        alt={bentoHero.name}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        style={bentoHero.imagePosition ? { objectPosition: bentoHero.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/80 via-transparent to-transparent opacity-60" />
                    </div>
                  </a>
                  <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 pointer-events-none">
                    <span className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 block font-[Manrope,sans-serif]">
                      {categoryLabels[bentoHero.id] || "Experience"}
                    </span>
                    <h3 className="font-[Newsreader,serif] text-2xl sm:text-4xl text-white mb-1">{bentoHero.name}</h3>
                    <p className="text-white/40 text-xs mb-3 font-[Manrope,sans-serif]">{bentoHero.price}</p>
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <a
                        href={getWhatsAppUrl(bentoHero)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-[#131313] px-6 py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 transition-colors font-[Manrope,sans-serif] inline-flex items-center gap-2"
                      >
                        <MessageCircle size={12} />
                        Inquire
                      </a>
                      <Link
                        to="/members/book"
                        className="text-xs tracking-[0.15em] uppercase text-white/30 hover:text-white/60 transition-colors font-[Manrope,sans-serif]"
                      >
                        View stays →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Vertical card — col-span-4, 3:4 */}
              {bentoVertical && (
                <div className="md:col-span-4 group relative overflow-hidden bg-[#1B1B1B]">
                  <a href={getWhatsAppUrl(bentoVertical)} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={bentoVertical.image}
                        alt={bentoVertical.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        style={bentoVertical.imagePosition ? { objectPosition: bentoVertical.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/80 via-transparent to-transparent" />
                    </div>
                  </a>
                  <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 pointer-events-none">
                    <span className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 block font-[Manrope,sans-serif]">
                      {categoryLabels[bentoVertical.id] || "Experience"}
                    </span>
                    <h3 className="font-[Newsreader,serif] text-2xl text-white mb-1">{bentoVertical.name}</h3>
                    <p className="text-white/40 text-xs mb-3 font-[Manrope,sans-serif]">{bentoVertical.price}</p>
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <a
                        href={getWhatsAppUrl(bentoVertical)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors font-[Manrope,sans-serif] inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={11} />
                        Inquire →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA card — col-span-4, square */}
              {bentoSquareCta && (
                <div className="md:col-span-4 bg-[#0E0E0E] flex flex-col justify-center items-center p-8 sm:p-12 text-center aspect-auto md:aspect-square">
                  <div className="text-white/15 text-4xl mb-6 font-[Newsreader,serif] italic">S</div>
                  <h3 className="font-[Newsreader,serif] text-xl text-white mb-3">The Silent Library</h3>
                  <p className="text-white/35 text-sm leading-relaxed mb-8 max-w-xs">
                    Access the private collection of curated stays that never appear on the public site.
                  </p>
                  <a
                    href="https://wa.me/41787002202?text=Hi%2C%20I'd%20like%20to%20know%20about%20exclusive%20curations."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#474747]/30 text-white px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#131313] transition-all font-[Manrope,sans-serif]"
                  >
                    Request Entry
                  </a>
                </div>
              )}

              {/* Wide card — col-span-8, 21:9 */}
              {bentoWide && (
                <div className="md:col-span-8 group relative overflow-hidden bg-[#1B1B1B]">
                  <a href={getWhatsAppUrl(bentoWide)} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-[21/9] overflow-hidden">
                      <img
                        src={bentoWide.image}
                        alt={bentoWide.name}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        style={bentoWide.imagePosition ? { objectPosition: bentoWide.imagePosition } : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#131313]/60 to-transparent" />
                    </div>
                  </a>
                  <div className="absolute left-6 sm:left-10 top-1/2 -translate-y-1/2 max-w-xs pointer-events-none">
                    <span className="text-xs tracking-[0.3em] uppercase text-white/50 mb-2 block font-[Manrope,sans-serif]">
                      {categoryLabels[bentoWide.id] || "Experience"}
                    </span>
                    <h3 className="font-[Newsreader,serif] text-2xl sm:text-3xl text-white mb-1">{bentoWide.name}</h3>
                    <p className="text-white/40 text-xs mb-3 font-[Manrope,sans-serif]">{bentoWide.price}</p>
                    <div className="flex items-center gap-3 pointer-events-auto">
                      <a
                        href={getWhatsAppUrl(bentoWide)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors font-[Manrope,sans-serif] inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={11} />
                        Inquire →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Remaining packages — 3-col grid */}
              {regularGrid.map((pkg) => (
                <div
                  key={pkg.id}
                  className="md:col-span-4 group bg-[#1B1B1B] overflow-hidden hover:bg-[#1F1F1F] transition-colors duration-500"
                >
                  <a href={getWhatsAppUrl(pkg)} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={pkg.image}
                        alt={pkg.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        style={pkg.imagePosition ? { objectPosition: pkg.imagePosition } : undefined}
                      />
                    </div>
                  </a>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs tracking-[0.3em] uppercase text-white/20 font-[Manrope,sans-serif]">
                        {pkg.duration}
                      </span>
                      {pkg.eventBadge && (
                        <span className="text-xs tracking-[0.15em] uppercase bg-white/5 text-white/40 px-2 py-0.5 font-[Manrope,sans-serif]">
                          {pkg.eventBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-[Newsreader,serif] text-lg text-white mb-2">{pkg.name}</h3>
                    <p className="text-white/30 text-xs leading-relaxed line-clamp-2 mb-4">{pkg.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/20 text-xs font-[Manrope,sans-serif]">{pkg.price}</span>
                      <a
                        href={getWhatsAppUrl(pkg)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs tracking-[0.15em] uppercase text-white/15 group-hover:text-white/40 transition-colors font-[Manrope,sans-serif] inline-flex items-center gap-1.5"
                      >
                        <MessageCircle size={10} />
                        Inquire →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Destinations strip ── */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-2 font-[Manrope,sans-serif]">
                Explore by
              </p>
              <h2 className="font-[Newsreader,serif] text-2xl text-white font-light">
                Destination
              </h2>
            </div>
            <Link
              to="/destinations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-[0.3em] uppercase text-white/25 hover:text-white transition-colors font-[Manrope,sans-serif] hidden sm:block"
            >
              All destinations →
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-2 px-2">
            {destinations.map((city) => (
              <Link
                key={city.slug}
                to={`/destinations/${city.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex-shrink-0 w-56 sm:w-64"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#1B1B1B] mb-3">
                  <img
                    src={city.heroImage}
                    alt={city.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={city.heroPosition ? { objectPosition: city.heroPosition } : undefined}
                  />
                </div>
                <h3 className="font-[Newsreader,serif] text-base text-white mb-1">{city.name}</h3>
                <p className="text-white/25 text-xs font-[Manrope,sans-serif]">{city.region}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Retreat spotlight ── */}
        {retreat && (
          <section className="mb-20">
            <div className="bg-[#0E0E0E] p-8 sm:p-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
              <div className="flex-1">
                <p className="text-xs tracking-[0.3em] uppercase text-white/25 mb-3 font-[Manrope,sans-serif]">
                  Immersive Retreat
                </p>
                <h2 className="font-[Newsreader,serif] text-3xl sm:text-4xl text-white italic mb-3">
                  {retreat.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-white/35 text-xs mb-4 font-[Manrope,sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    {retreat.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {retreat.location}
                  </span>
                </div>
                {retreat.tiers.signature && (
                  <div className="flex flex-wrap gap-6 mt-4">
                    {Object.entries(retreat.tiers).map(([key, tier]) => (
                      tier && (
                        <div key={key}>
                          <p className="text-white/15 text-xs uppercase tracking-widest mb-1 font-[Manrope,sans-serif]">{tier.label}</p>
                          <p className="text-white text-sm">
                            {tier.currency} {tier.amount.toLocaleString()}
                          </p>
                          <p className="text-white/25 text-xs mt-0.5">{tier.description}</p>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
              <a
                href="https://wa.me/41787002202?text=Hi%2C%20I'm%20interested%20in%20The%20Spring%20Intake%20retreat."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#131313] px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 transition-colors font-[Manrope,sans-serif] inline-block w-fit shrink-0"
              >
                Inquire
                <ArrowRight size={12} className="inline ml-2" />
              </a>
            </div>
          </section>
        )}

        {/* ── Attributed testimonial ── */}
        <section className="mb-20 py-16 sm:py-24 bg-[#0E0E0E] -mx-6 sm:-mx-10 lg:-mx-16 px-6 sm:px-10 lg:px-16 relative overflow-hidden">
          {/* Background watermark */}
          <div className="absolute -right-16 top-0 opacity-[0.03] pointer-events-none select-none">
            <span className="font-[Newsreader,serif] text-[20rem] leading-none text-white italic">S</span>
          </div>

          <div className="max-w-3xl relative z-10 ml-auto text-right">
            <p className="font-[Newsreader,serif] text-3xl sm:text-4xl lg:text-5xl text-white/80 italic leading-snug mb-8">
              "{featuredJournal.quote}"
            </p>
            <div className="flex items-center justify-end gap-4">
              <div>
                <span className="text-xs tracking-[0.25em] uppercase text-white block font-[Manrope,sans-serif]">
                  {featuredJournal.guests}
                </span>
                <span className="text-xs text-white/30 block mt-1 font-[Manrope,sans-serif]">
                  {featuredJournal.date}
                </span>
              </div>
              <div className="w-14 h-14 overflow-hidden border border-[#474747]/20">
                <img
                  src={featuredJournal.coverImage}
                  alt={featuredJournal.guests}
                  className="w-full h-full object-cover grayscale"
                  style={{ objectPosition: featuredJournal.coverPosition?.replace("object-", "") || "center" }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Guest Stories ── */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-[Newsreader,serif] text-2xl text-white font-light">
              Guest Stories
            </h2>
            <Link
              to="/journals"
              className="text-xs tracking-[0.3em] uppercase text-white/25 hover:text-white transition-colors font-[Manrope,sans-serif] hidden sm:block"
            >
              Read all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {journals.map((journal) => (
              <Link
                key={journal.id}
                to={`/journals/${journal.slug}`}
                className="group relative overflow-hidden bg-[#1B1B1B]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={journal.coverImage}
                    alt={journal.guests}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{ objectPosition: journal.coverPosition?.replace("object-", "") || "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-xs tracking-[0.2em] uppercase text-white/30 block mb-1.5 font-[Manrope,sans-serif]">
                    {journal.date}
                  </span>
                  <h3 className="font-[Newsreader,serif] text-lg text-white mb-1">{journal.guests}</h3>
                  <p className="text-white/35 text-xs italic">{journal.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="mb-16 bg-[#1B1B1B] p-8 sm:p-12">
          <h2 className="font-[Newsreader,serif] text-2xl text-white mb-3">
            Nothing here speaks to you?
          </h2>
          <p className="text-white/40 text-sm max-w-md mb-6 leading-relaxed font-[Manrope,sans-serif]">
            Tell us what you're looking for. We'll curate something that doesn't exist yet.
          </p>
          <a
            href="https://wa.me/41787002202?text=Hi%2C%20I'm%20looking%20for%20a%20custom%20experience."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#131313] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/90 transition-colors font-[Manrope,sans-serif]"
          >
            Start a conversation
            <ArrowRight size={14} />
          </a>
        </section>
      </div>

      {/* no-scrollbar utility for destinations strip */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </MembersLayout>
  );
}
