import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { Founder } from "@/components/Founder";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  const navigate = useNavigate();
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

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Swissperiences",
    "url": "https://swissperiences.ch",
    "logo": "https://swissperiences.ch/favicon-512x512.png",
    "description": "A private network of curated alpine sanctuaries for those seeking silence in a noisy world.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CH",
      "addressLocality": "Geneva"
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <SEO structuredData={structuredData} />

      {/* Background Video with Parallax */}
      <div
        className="fixed inset-0 z-0"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-50"
          poster="/videos/hero-poster.jpg"
        >
          <source src="/videos/hero-optimized.webm" type="video/webm" />
          <source src="/videos/hero-final.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col">

        <Navigation />

        {/* ═══════════════════════════════════════════
            1. HERO — The Statement
        ═══════════════════════════════════════════ */}
        <section className="min-h-screen flex flex-col justify-center items-center px-8 relative">
          <div
            className={`text-center max-w-4xl transition-all duration-[2000ms] ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              <span className="block text-white/90">Switzerland is boring.</span>
              <span className="block mt-4 text-white/50 italic">Thank god.</span>
            </h1>

            <div className="w-16 h-px bg-white/20 mx-auto my-12" />

            <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-4">
              No noise. No agenda. No performance.
            </p>
            <p className="text-white/30 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
              And in that nothing, you'll find everything you forgot you had.
            </p>
          </div>

          <div
            className={`mt-16 transition-all duration-[2000ms] delay-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative px-12 py-4 border border-white/20 hover:border-white/40 transition-all duration-500"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 group-hover:text-white transition-colors">
                Request Access
              </span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          <div
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-[2000ms] delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            2. WHAT WE ACTUALLY DO — Visual proof
        ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-8 bg-gradient-to-b from-transparent via-black/50 to-[#0a0a0a]">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-16 md:mb-20">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
                What We Curate
              </span>
              <p className="text-white/50 text-lg md:text-xl font-light max-w-2xl mx-auto">
                Private alpine sanctuaries. Curated experiences.
                Designed for those who need nothing but space.
              </p>
            </div>

            {/* Three visual cards */}
            <div className="grid md:grid-cols-3 gap-6 md:gap-8">

              {/* The Sanctuary */}
              <Link to="/sanctuaries/villars" className="group block">
                <div className="aspect-[3/4] relative overflow-hidden mb-4">
                  <img
                    src="/images/apt-living-room-1.jpg"
                    alt="The Alpine Loft in Villars"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Villars-sur-Ollon</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-white/80 mb-1">The Alpine Sanctuary</h3>
                <p className="text-white/40 text-sm">A private loft above the clouds, 1,300m.</p>
              </Link>

              {/* The Road Journey */}
              <Link to="/experiences/road-journey" className="group block">
                <div className="aspect-[3/4] relative overflow-hidden mb-4">
                  <img
                    src="/images/range-rover-villars.jpg"
                    alt="Range Rover on Swiss alpine roads"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Curated Experience</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-white/80 mb-1">The Road Journey</h3>
                <p className="text-white/40 text-sm">Swiss alpine passes. Your story at the wheel.</p>
              </Link>

              {/* The Private Chef */}
              <Link to="/experiences/private-chef" className="group block">
                <div className="aspect-[3/4] relative overflow-hidden mb-4">
                  <img
                    src="/images/loft/IMG_8759.jpg"
                    alt="Private dining at the Alpine Loft"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/50">Members Only</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-white/80 mb-1">The Private Chef</h3>
                <p className="text-white/40 text-sm">Alpine gastronomy in the intimacy of your sanctuary.</p>
              </Link>

            </div>

            <div className="text-center mt-12">
              <Link
                to="/experiences"
                className="text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors border-b border-white/10 hover:border-white/30 pb-1"
              >
                View All Experiences
              </Link>
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. JOURNAL PROOF — Real guests, real stories
        ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-6xl mx-auto">

            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">

              {/* Left — Guest photo */}
              <Link to="/journals/the-winter-ascent" className="group block">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img
                    src="/images/guests/wagner/1.jpeg"
                    alt="Wagner, Andreia & Helena — The Winter Ascent"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/50 mb-2 block">February 2024</span>
                    <p className="font-serif text-lg text-white/80 italic">"One weekend. A lifetime of memories."</p>
                  </div>
                </div>
              </Link>

              {/* Right — Story context */}
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
                  From Our Journals
                </span>

                <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-6 leading-tight">
                  The Winter Ascent
                </h2>

                <p className="text-white/50 text-base leading-relaxed mb-4">
                  Wagner, Andreia & Helena. A seamless 48-hour condensed Grand Tour. From Geneva's urban elegance to the deep heart of the Bernese Oberland.
                </p>

                <p className="text-white/30 text-sm leading-relaxed mb-8">
                  Lavaux vineyards. Grindelwald at dusk. Lauterbrunnen's 72 waterfalls. Blausee at dawn. Every detail curated, every moment intentional.
                </p>

                <Link
                  to="/journals/the-winter-ascent"
                  className="text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors border-b border-white/10 hover:border-white/30 pb-1"
                >
                  Read the Full Story
                </Link>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <Link
                    to="/journals"
                    className="text-[11px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
                  >
                    View All Journals →
                  </Link>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            4. THE HOST — Founder
        ═══════════════════════════════════════════ */}
        <Founder />

        {/* ═══════════════════════════════════════════
            5. FOR WHO — Audience alignment
        ═══════════════════════════════════════════ */}
        <section className="py-24 md:py-32 px-8 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto w-full">

            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
                  For Those Who
                </span>

                <div className="space-y-4">
                  <p className="text-white/70 text-lg md:text-xl leading-relaxed">
                    Built empires but forgot how to rest.
                  </p>
                  <p className="text-white/50 text-lg md:text-xl leading-relaxed">
                    Have all the dreams in the world.
                  </p>
                  <p className="text-white/30 text-lg md:text-xl leading-relaxed">
                    Seek permission to do nothing.
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-white/40 text-sm leading-relaxed">
                    Membership is by application only. We review each request
                    to ensure alignment with our community.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                  <img
                    src="/images/villars-sunrise.jpg"
                    alt="Dents du Midi at sunrise, sea of clouds"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                      Villars-sur-Ollon, Switzerland
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            6. THE NETWORK — Sanctuaries preview
        ═══════════════════════════════════════════ */}
        <section className="py-24 px-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">

            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
              The Network
            </span>

            <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-12">
              Three sanctuaries. <span className="text-white/40 italic">One philosophy.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">

              <Link to="/sanctuaries/villars" className="text-left p-6 border border-white/10 hover:border-white/20 transition-colors block">
                <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 mb-2 block">
                  Active
                </span>
                <h3 className="font-serif text-xl text-white/80 mb-2">Villars</h3>
                <p className="text-white/40 text-sm">Swiss Alps, 1,300m</p>
              </Link>

              <div className="text-left p-6 border border-white/5 opacity-50">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2 block">
                  2027
                </span>
                <h3 className="font-serif text-xl text-white/50 mb-2">Verbier</h3>
                <p className="text-white/30 text-sm">Valais</p>
              </div>

              <div className="text-left p-6 border border-white/5 opacity-50">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2 block">
                  2028
                </span>
                <h3 className="font-serif text-xl text-white/50 mb-2">Zermatt</h3>
                <p className="text-white/30 text-sm">Matterhorn</p>
              </div>

            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            7. FINAL CTA
        ═══════════════════════════════════════════ */}
        <section className="py-32 px-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">

            <h2 className="font-serif text-4xl md:text-5xl text-white/90 mb-6">
              The silence is waiting.
            </h2>

            <p className="text-white/40 text-lg mb-12">
              Apply for membership. We'll be in touch within 48 hours.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="group relative px-16 py-5 bg-white text-black hover:bg-white/90 transition-all duration-500"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
                Request Access
              </span>
            </button>

          </div>
        </section>

        <Footer />

      </main>

    </div>
  );
};

export default Index;
