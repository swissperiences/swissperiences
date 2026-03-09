import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { packages } from "@/data/packages";

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
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-glacier-500/20 transition-colors duration-500"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={pkg.image}
                  alt={`${pkg.name} — ${pkg.tagline}`}
                  className={`w-full h-full object-cover brightness-[0.5] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-700 ${pkg.imagePosition || ""}`}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
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
