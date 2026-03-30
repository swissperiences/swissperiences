import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { packages } from "@/data/packages";

/** Maps full-size image paths to 800px preview versions for card display */
function getPreviewSrc(src: string): string | null {
  const basename = src.split("/").pop();
  if (!basename) return null;
  // Only images that have generated previews
  const previews = new Set([
    "alpine-reset-lake.jpeg", "winter-escape-ski-sunset.jpeg",
    "cinematic-alpine-road.jpeg", "loft-fireplace-night.jpeg",
    "loft-fireplace-evening.jpeg", "lavaux-vineyards-sunset.jpeg",
    "sea-of-clouds-sunset.jpeg", "dawn-fog-chalets.jpeg",
    "villars-autumn-sunset.jpg", "sunset-golden.jpeg",
  ]);
  return previews.has(basename) ? `/images/_preview/${basename}` : null;
}

const MONTH_MAP: Record<string, number> = {
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
  july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
};

function getSeasonBadge(availability: string): { label: string; active: boolean } {
  if (/year.?round/i.test(availability)) return { label: "Available year-round", active: true };

  const match = availability.match(/(\w+)\s*[—–-]\s*(\w+)/i);
  if (!match) return { label: availability, active: true };

  const start = MONTH_MAP[match[1].toLowerCase()];
  const end = MONTH_MAP[match[2].toLowerCase()];
  const now = new Date().getMonth() + 1;

  const inSeason = start <= end
    ? now >= start && now <= end
    : now >= start || now <= end;

  if (inSeason) return { label: "In season now", active: true };

  // Find next start month name
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return { label: `Opens ${monthNames[start - 1]}`, active: false };
}

interface PackagesPreviewProps {
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function PackagesPreview({ visible, sectionRef }: PackagesPreviewProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  function handleCTA() {
    if (isLoggedIn) {
      navigate("/members");
    } else {
      const el = document.getElementById("request-quote");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      id="packages"
      ref={sectionRef}
      className={`py-24 md:py-32 px-4 sm:px-8 bg-[#060606] border-t border-white/5 transition-all duration-[1500ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-6 block">
            Curated Packages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-4">
            Choose your tempo.
          </h2>
          <p className="text-white/50 text-base font-light max-w-xl mx-auto">
            Each package is a complete stay — loft, activities, and cinematic memories, curated around a single idea.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {packages.slice(0, 8).map((pkg, i) => (
            <div
              key={pkg.id}
              className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-glacier-500/20 transition-colors duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={getPreviewSrc(pkg.image) || pkg.image}
                  srcSet={getPreviewSrc(pkg.image) ? `${getPreviewSrc(pkg.image)} 800w, ${pkg.image} 2000w` : undefined}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  alt={`${pkg.name} — ${pkg.tagline}`}
                  className={`w-full h-full object-cover brightness-[0.5] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-700 ${pkg.imagePosition || ""}`}
                  loading={i < 4 ? "eager" : "lazy"}
                  {...(i < 2 ? { fetchPriority: "high" as const } : {})}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  {pkg.eventBadge ? (
                    <span className="text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm px-3 py-1 border text-fuchsia-300/80 bg-fuchsia-900/30 border-fuchsia-500/20">
                      {pkg.eventBadge}
                    </span>
                  ) : (() => {
                    const badge = getSeasonBadge(pkg.availability);
                    return (
                      <span className={`text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm px-3 py-1 border ${
                        badge.active
                          ? "text-emerald-300/70 bg-emerald-900/30 border-emerald-500/20"
                          : "text-white/40 bg-black/40 border-white/10"
                      }`}>
                        {badge.label}
                      </span>
                    );
                  })()}
                  <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 bg-black/40 backdrop-blur-sm px-3 py-1 border border-white/10">
                    {pkg.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <h3 className="font-serif text-xl md:text-2xl text-white/85 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-white/40 text-sm font-light italic mb-6">
                  {pkg.tagline}
                </p>

                {/* Inclusions */}
                <div className="space-y-2 mb-8">
                  {pkg.previewIncludes.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <span className="w-1 h-1 mt-2 bg-white/20 rounded-full shrink-0" />
                      <span className="text-white/50 text-sm">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between gap-4 pt-4 border-t border-white/5">
                  <div>
                    {isLoggedIn ? (
                      <>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 block mb-1">
                          {pkg.soloPrice ? "Solo" : "Starting at"}
                        </span>
                        <span className="text-white/70 text-lg font-serif">
                          {pkg.soloPrice || pkg.price.replace("From ", "")}
                        </span>
                        {pkg.couplePrice && (
                          <span className="text-white/40 text-xs block mt-1">
                            Couple {pkg.couplePrice}
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-white/50 text-sm font-serif italic">
                        Members only
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleCTA()}
                    className="text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors border-b border-white/20 hover:border-glacier-500/40 pb-0.5"
                  >
                    {isLoggedIn ? "Book Now" : "Request a Quote"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all link */}
        <div className="text-center mt-12">
          <Link
            to="/packages"
            className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-white/70 transition-colors border-b border-white/15 hover:border-glacier-500/30 pb-1"
          >
            View All Packages & Details
          </Link>
        </div>
      </div>
    </section>
  );
}
