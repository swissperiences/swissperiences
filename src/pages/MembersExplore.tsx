/**
 * MembersExplore — Alpine Silence curated editorial grid
 *
 * Displays all packages in an asymmetric editorial layout.
 * Visual-first: static data from packages + journals.
 */
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { packages } from "@/data/packages";
import { journals } from "@/data/journals";
import { ArrowRight } from "lucide-react";

export default function MembersExplore() {
  // Split packages into hero (first) + grid (rest)
  const hero = packages[0];
  const grid = packages.slice(1);

  return (
    <MembersLayout>
      <SEO title="Curations | Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-5xl">
        {/* ── Header ── */}
        <section className="mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 font-[Manrope,sans-serif]">
            The Curations
          </p>
          <h1 className="font-[Newsreader,serif] text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-[1.1] mb-4">
            The Art of <em className="italic">Silence.</em>
          </h1>
          <p className="text-white/40 text-sm max-w-lg leading-relaxed font-[Manrope,sans-serif]">
            A curated collection of brief journeys where true discovery begins. Selected
            based on luxury, preference for tranquility, architecture and alpine
            landscapes.
          </p>
        </section>

        {/* ── Hero curation ── */}
        {hero && (
          <section className="mb-12">
            <div className="group relative overflow-hidden bg-[#1B1B1B]">
              <div className="aspect-[21/9] sm:aspect-[21/8] overflow-hidden">
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                  style={hero.imagePosition ? { objectPosition: hero.imagePosition } : undefined}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                {hero.eventBadge && (
                  <span className="inline-block text-[10px] tracking-[0.2em] uppercase bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 mb-3">
                    {hero.eventBadge}
                  </span>
                )}
                <h2 className="font-[Newsreader,serif] text-3xl sm:text-4xl text-white mb-2">
                  {hero.name}
                </h2>
                <p className="text-white/50 text-sm max-w-md mb-4">{hero.tagline}</p>
                <div className="flex items-center gap-6">
                  <span className="text-white/30 text-xs uppercase tracking-widest">{hero.duration}</span>
                  <span className="text-white/30 text-xs">{hero.price}</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Asymmetric grid ── */}
        <section className="mb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {grid.map((pkg, i) => {
              // Make every 4th item span 2 columns for asymmetry
              const isWide = i % 4 === 2 && i < grid.length - 1;
              return (
                <div
                  key={pkg.id}
                  className={`group bg-[#1B1B1B] overflow-hidden hover:bg-[#1F1F1F] transition-colors duration-500 ${
                    isWide ? "sm:col-span-2" : ""
                  }`}
                >
                  <div className={`overflow-hidden ${isWide ? "aspect-[16/7]" : "aspect-[4/3]"}`}>
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      style={pkg.imagePosition ? { objectPosition: pkg.imagePosition } : undefined}
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] tracking-[0.3em] uppercase text-white/25">{pkg.duration}</span>
                      {pkg.eventBadge && (
                        <span className="text-[10px] tracking-[0.2em] uppercase bg-white/5 text-white/40 px-2 py-0.5">
                          {pkg.eventBadge}
                        </span>
                      )}
                    </div>
                    <h3 className="font-[Newsreader,serif] text-lg text-white mb-2">{pkg.name}</h3>
                    <p className="text-white/35 text-xs leading-relaxed line-clamp-2 mb-4">
                      {pkg.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/25 text-xs">{pkg.price}</span>
                      <span className="text-[10px] tracking-[0.2em] uppercase text-white/20 group-hover:text-white/50 transition-colors">
                        View details →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Editorial quote break ── */}
        <section className="mb-20 py-12 sm:py-16 border-t border-b border-[#1F1F1F]">
          <blockquote className="max-w-2xl mx-auto text-center">
            <p className="font-[Newsreader,serif] text-xl sm:text-2xl text-white/70 italic leading-relaxed">
              "Switzerland is boring. Beautifully so."
            </p>
          </blockquote>
        </section>

        {/* ── Guest Stories ── */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-[Newsreader,serif] text-2xl text-white font-light">
              Guest Stories
            </h2>
            <Link
              to="/journals"
              className="text-[10px] tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors font-[Manrope,sans-serif] hidden sm:block"
            >
              Read all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {journals.slice(0, 2).map((journal) => (
              <Link
                key={journal.id}
                to={`/journals/${journal.slug}`}
                className="group relative overflow-hidden bg-[#1B1B1B]"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={journal.coverImage}
                    alt={journal.guests}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    style={{ objectPosition: journal.coverPosition?.replace("object-", "") || "center" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-2">
                    {journal.date}
                  </span>
                  <h3 className="font-[Newsreader,serif] text-xl text-white mb-1">{journal.guests}</h3>
                  <p className="text-white/40 text-xs italic">{journal.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="mb-16 bg-[#1B1B1B] p-8 sm:p-12">
          <h2 className="font-[Newsreader,serif] text-2xl text-white mb-3">
            Nothing here speaks to you?
          </h2>
          <p className="text-white/40 text-sm max-w-md mb-6 leading-relaxed">
            Tell us what you're looking for. We'll curate something that doesn't exist yet.
          </p>
          <a
            href="https://wa.me/41787002202?text=Hi%2C%20I'm%20looking%20for%20a%20custom%20experience."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-white text-[#131313] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/90 transition-colors"
          >
            Start a conversation
            <ArrowRight size={14} />
          </a>
        </section>
      </div>
    </MembersLayout>
  );
}
