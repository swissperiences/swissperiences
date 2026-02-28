import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import SEO from "@/components/SEO";
import { buildBreadcrumbJsonLd } from "@/components/Breadcrumbs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { packages } from "@/data/packages";

export default function Packages() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  function handleCTA() {
    if (isLoggedIn) {
      navigate("/members");
    } else {
      navigate("/#request-quote");
    }
  }

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { label: "Home", href: "https://www.swissperiences.ch/" },
    { label: "Packages", href: "https://www.swissperiences.ch/packages" },
  ]);

  const productsJsonLd = packages.map((pkg) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: pkg.name,
    description: pkg.description,
    image: `https://www.swissperiences.ch${pkg.image}`,
    brand: { "@type": "Brand", name: "Swissperiences" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CHF",
      price: (pkg.soloPrice || pkg.price).replace(/[^0-9]/g, ""),
      availability: "https://schema.org/LimitedAvailability",
      url: `https://www.swissperiences.ch/packages#${pkg.id}`,
    },
  }));

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO
        title="Curated Alpine Packages | Swissperiences"
        description="Complete curated stays in the Swiss Alps. From The Alpine Reset to The Grand Tour — each package includes The Sanctuary Loft, activities, and cinematic memories."
        keywords="swiss alpine packages, switzerland holiday packages, luxury chalet stay, villars packages, curated swiss vacation"
        canonical="https://www.swissperiences.ch/packages"
        structuredData={[breadcrumbJsonLd, ...productsJsonLd]}
      />
      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-8 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-6">
            Curated Packages
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white/85 leading-[1.1] mb-6">
            Choose your tempo.
          </h1>
          <p className="text-white/40 text-lg font-light max-w-2xl mx-auto">
            Every package is a complete stay — loft, activities, and memories — curated around a single idea.
            All prices include The Sanctuary Loft in Villars-sur-Ollon.
          </p>
        </div>
      </section>

      {/* Packages */}
      <section className="px-4 sm:px-8 md:px-16 pb-24 md:pb-32">
        <div className="max-w-5xl mx-auto space-y-20 md:space-y-32">
          {packages.map((pkg, i) => (
            <article
              key={pkg.id}
              id={pkg.id}
              className="scroll-mt-24"
            >
              {/* Image */}
              <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-8 rounded-sm">
                <img
                  src={pkg.image}
                  alt={`${pkg.name} — ${pkg.tagline}`}
                  className={`w-full h-full object-cover brightness-[0.55] ${pkg.imagePosition || ""}`}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
                    {pkg.duration} · {pkg.availability}
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white/90">
                    {pkg.name}
                  </h2>
                  <p className="text-white/50 font-light italic text-base sm:text-lg mt-2">
                    {pkg.tagline}
                  </p>
                </div>
              </div>

              {/* Content grid */}
              <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                {/* Left column — description */}
                <div className="md:col-span-3">
                  <p className="text-white/60 text-base md:text-lg font-light leading-relaxed mb-8">
                    {pkg.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {pkg.highlights.map((h) => (
                      <span
                        key={h}
                        className="text-[9px] uppercase tracking-[0.2em] text-white/30 border border-white/10 px-3 py-1.5"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right column — inclusions + price */}
                <div className="md:col-span-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 block mb-4">
                    What's Included
                  </span>
                  <div className="space-y-3 mb-8">
                    {pkg.includes.map((item) => (
                      <div key={item} className="flex items-start gap-2.5">
                        <span className="w-1 h-1 mt-2 bg-white/20 rounded-full shrink-0" />
                        <span className="text-white/50 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                      Group Size
                    </span>
                    <span className="text-white/50 text-sm">{pkg.groupSize}</span>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    {pkg.soloPrice ? (
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.15em] text-white/30 block mb-1">Solo</span>
                          <span className="text-white/80 text-lg font-serif">{pkg.soloPrice}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.15em] text-white/30 block mb-1">Couple</span>
                          <span className="text-white/50 text-lg font-serif">{pkg.couplePrice}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-[0.15em] text-white/30 block mb-1">Group</span>
                          <span className="text-white/50 text-lg font-serif">{pkg.groupPrice}</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 block mb-1">
                          Starting at
                        </span>
                        <span className="text-white/80 text-2xl font-serif block mb-6">
                          {pkg.price.replace("From ", "")}
                        </span>
                      </>
                    )}
                    <button
                      onClick={handleCTA}
                      className="w-full px-8 py-4 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300"
                    >
                      {isLoggedIn ? "Book This Package" : "Request a Quote"}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 md:py-28 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 block mb-6">
            Something Else in Mind?
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-white/80 mb-4">
            We also build custom stays.
          </h3>
          <p className="text-white/40 text-base font-light mb-8">
            If none of these packages match what you're looking for, tell us what you have in mind.
            Every stay starts as a conversation.
          </p>
          <button
            onClick={handleCTA}
            className="px-12 py-4 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-300"
          >
            {isLoggedIn ? "Contact Us" : "Start a Conversation"}
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
