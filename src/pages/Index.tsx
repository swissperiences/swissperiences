import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import SEO from "@/components/SEO";
import { Founder } from "@/components/Founder";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import TrustBar from "@/components/TrustBar";
import GuestQuotes from "@/components/GuestQuotes";
import RequestQuoteForm from "@/components/RequestQuoteForm";
import PackagesPreview from "@/components/PackagesPreview";
import { useAuth } from "@/hooks/use-auth";

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Scroll-triggered fade-in
  const useScrollReveal = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setVisible(true); },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return { ref, visible };
  };

  const s1 = useScrollReveal(); // Sanctuary full-bleed
  const s2 = useScrollReveal(); // Statement
  const s3 = useScrollReveal(); // Packages preview
  const s4 = useScrollReveal(); // Guest quotes
  const s5 = useScrollReveal(); // Journal
  const s6 = useScrollReveal(); // For Those Who
  const s7 = useScrollReveal(); // Final CTA

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
      "logo": "https://www.swissperiences.ch/favicon-512x512.png",
      "description": "A private network of curated alpine sanctuaries for those seeking silence in a noisy world.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CH",
        "addressLocality": "Geneva",
      },
      "sameAs": [
        "https://instagram.com/swissperiences",
        "https://linkedin.com/company/swissperiences",
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
    },
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
      "priceRange": "CHF 1,500 – CHF 4,500",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Geneva",
        "addressCountry": "CH",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.2044,
        "longitude": 6.1432,
      },
      "areaServed": "Switzerland",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO canonical="https://www.swissperiences.ch/en" structuredData={structuredData} />

      {/* ════════════════════════════════════════
          1. HERO — Full-screen video, editorial type
      ════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        {/* Video background */}
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <video
            autoPlay muted loop playsInline
            className="w-full h-full object-cover"
            poster="/videos/hero-poster.jpg"
          >
            <source src="/videos/hero-optimized.webm" type="video/webm" />
            <source src="/videos/hero-final.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#060606]" />
        </div>

        <Navigation />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-16 lg:px-24">
          <div
            className={`max-w-5xl transition-all duration-[2500ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <h1 className="font-serif text-[clamp(3rem,8vw,9rem)] leading-[0.85] tracking-tight">
              <span className="block text-white">Switzerland</span>
              <span className="block text-white">is boring.</span>
              <span className="block mt-2 text-white/40 italic text-[clamp(2.5rem,6vw,7rem)]">Beautifully so.</span>
            </h1>
          </div>

          <div
            className={`mt-12 flex flex-wrap items-center gap-4 md:gap-8 transition-all duration-[2500ms] delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/members')}
                className="group px-10 py-4 border border-white/20 hover:border-white/50 transition-all duration-500"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 group-hover:text-white transition-colors">
                  Enter Member Area
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    const el = document.getElementById("request-quote");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-10 py-4 bg-white text-black hover:bg-white/90 transition-all duration-500"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
                    Request Your Stay
                  </span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="group px-8 py-4 border border-white/15 hover:border-white/40 transition-all duration-500"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white/70 transition-colors">
                    Sign In
                  </span>
                </button>
              </>
            )}
            <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-white/20">
              Private alpine club — Villars-sur-Ollon, 1,300m
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-[2000ms] delay-1500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. TRUST BAR
      ════════════════════════════════════════ */}
      <TrustBar />

      {/* ════════════════════════════════════════
          3. FULL-BLEED IMAGE — The Sanctuary
      ════════════════════════════════════════ */}
      <section
        ref={s1.ref}
        className={`relative transition-all duration-[1500ms] ease-out ${s1.visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative h-[70vh] md:h-screen overflow-hidden">
          <img
            src="/images/villars/loft-balcony-winter-evening.jpeg"
            alt="The Villars Loft balcony at blue hour — snow-capped Alps at 1,300m"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          {/* Asymmetric text overlay */}
          <div className="absolute inset-0 flex items-end md:items-center px-8 md:px-16 lg:px-24 pb-16 md:pb-0">
            <div className="max-w-lg">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-6">
                The Sanctuary
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[0.9] mb-6">
                Above the<br />clouds.
              </h2>
              <p className="text-white/50 text-base md:text-lg font-light leading-relaxed mb-4 max-w-sm">
                A private alpine loft at 1,300m. Fireplace. Balcony over the valley. Silence as a feature.
              </p>
              <p className="text-white/25 text-xs mb-8">
                From CHF —/night · Members-only pricing
              </p>
              <div className="flex items-center gap-6">
                <Link
                  to="/sanctuaries/villars"
                  className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors border-b border-white/20 hover:border-white/50 pb-1"
                >
                  Discover
                </Link>
                {!isLoggedIn && (
                  <button
                    onClick={() => {
                      const el = document.getElementById("request-quote");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    Request a Quote
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. STATEMENT
      ════════════════════════════════════════ */}
      <section
        ref={s2.ref}
        className={`py-32 md:py-48 px-8 md:px-16 bg-[#060606] transition-all duration-[1500ms] ease-out ${s2.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-5xl mx-auto">
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-white/80 leading-[1.1] tracking-tight">
            We don't sell experiences.
            <span className="text-white/30 italic"> We curate the art of doing nothing.</span>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. PACKAGES PREVIEW
      ════════════════════════════════════════ */}
      <PackagesPreview visible={s3.visible} sectionRef={s3.ref} />

      {/* ════════════════════════════════════════
          6. GUEST QUOTES
      ════════════════════════════════════════ */}
      <GuestQuotes visible={s4.visible} sectionRef={s4.ref} />

      {/* ════════════════════════════════════════
          7. REQUEST A QUOTE
      ════════════════════════════════════════ */}
      <RequestQuoteForm />

      {/* ════════════════════════════════════════
          8. JOURNAL — Editorial story feature
      ════════════════════════════════════════ */}
      <section
        ref={s5.ref}
        className={`py-24 md:py-40 px-8 md:px-16 lg:px-24 bg-[#060606] transition-all duration-[1500ms] ease-out ${s5.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-center">

            <Link to="/journals/the-winter-ascent" className="md:col-span-6 group block">
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src="/images/guests/wagner/1.jpeg"
                  alt="Wagner, Andreia & Helena"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-[1200ms]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </Link>

            <div className="md:col-span-5 md:col-start-8">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/30 block mb-8">
                From the Journals
              </span>

              <h2 className="font-serif text-4xl md:text-5xl text-white/80 mb-6 leading-[0.95]">
                The Winter<br />Ascent
              </h2>

              <p className="text-white/40 text-base leading-relaxed mb-4">
                Wagner, Andreia & Helena. A 48-hour condensed Grand Tour — from Geneva to the Bernese Oberland.
              </p>

              <p className="text-white/25 text-sm leading-relaxed mb-10">
                Lavaux. Grindelwald at dusk. Lauterbrunnen's waterfalls. Every detail curated.
              </p>

              <Link
                to="/journals/the-winter-ascent"
                className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors border-b border-white/20 hover:border-white/50 pb-1"
              >
                Read the Story
              </Link>

              <div className="mt-16 pt-8 border-t border-white/5">
                <Link
                  to="/journals"
                  className="text-[10px] uppercase tracking-[0.3em] text-white/20 hover:text-white/50 transition-colors"
                >
                  All Journals →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          9. THE HOST — Founder
      ════════════════════════════════════════ */}
      <Founder />

      {/* ════════════════════════════════════════
          10. FOR THOSE WHO — Manifesto
      ════════════════════════════════════════ */}
      <section
        ref={s6.ref}
        className={`relative py-32 md:py-48 overflow-hidden transition-all duration-[1500ms] ease-out ${s6.visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0">
          <img
            src="/images/villars-sunrise.jpg"
            alt="Sunrise over the Alps"
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-[#060606]/60" />
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/25 block mb-10">
            For Those Who
          </span>

          <div className="space-y-6">
            <p className="font-serif text-3xl md:text-5xl text-white/70 leading-[1.1]">
              Built empires but forgot how to rest.
            </p>
            <p className="font-serif text-3xl md:text-5xl text-white/40 leading-[1.1]">
              Travel alone but never feel lonely.
            </p>
            <p className="font-serif text-3xl md:text-5xl text-white/20 leading-[1.1]">
              Seek permission to do nothing.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 max-w-md">
            <p className="text-white/30 text-sm leading-relaxed mb-6">
              {isLoggedIn
                ? "You're already part of this world. Your next escape is one message away."
                : "Membership is by application only. We review each request to ensure alignment with our community."}
            </p>
            {!isLoggedIn && (
              <Link
                to="/login"
                className="text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white/60 transition-colors border-b border-white/10 hover:border-white/40 pb-1"
              >
                Apply for Membership
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          11. FINAL CTA
      ════════════════════════════════════════ */}
      <section
        ref={s7.ref}
        className={`py-40 md:py-56 px-8 bg-[#060606] transition-all duration-[1500ms] ease-out ${s7.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-5xl md:text-7xl text-white/90 mb-8 leading-[0.9]">
            {isLoggedIn ? "Your next escape." : "The silence is waiting."}
          </h2>

          <p className="text-white/30 text-lg mb-16 font-light">
            {isLoggedIn
              ? "Browse sanctuaries, plan experiences, and let us handle the rest."
              : "Start with a question. We'll handle everything else."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/members')}
                className="group px-16 py-5 bg-white text-black hover:bg-white/90 transition-all duration-500"
              >
                <span className="text-[11px] uppercase tracking-[0.3em] font-medium">
                  Member Area
                </span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    const el = document.getElementById("request-quote");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group px-12 py-5 bg-white text-black hover:bg-white/90 transition-all duration-500"
                >
                  <span className="text-[11px] uppercase tracking-[0.3em] font-medium">
                    Start with a Question
                  </span>
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="group px-10 py-5 border border-white/15 hover:border-white/40 transition-all duration-500"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 group-hover:text-white/70 transition-colors">
                    Apply for Membership
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
