import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SEO from "@/components/SEO";

const Index = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Fade in on mount
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Parallax scroll effect
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

      {/* Background Video/Image with Parallax */}
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

        {/* Navigation - Minimal */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Swissperiences
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              Geneva, CH
            </span>
          </div>
        </nav>

        {/* Hero Section - Full Height */}
        <section className="min-h-screen flex flex-col justify-center items-center px-8 relative">

          {/* The Statement */}
          <div
            className={`text-center max-w-4xl transition-all duration-[2000ms] ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Main Headline */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
              <span className="block text-white/90">Switzerland is boring.</span>
              <span className="block mt-4 text-white/50 italic">Thank god.</span>
            </h1>

            {/* Divider */}
            <div className="w-16 h-px bg-white/20 mx-auto my-12" />

            {/* Philosophy */}
            <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto mb-4">
              No noise. No agenda. No performance.
            </p>
            <p className="text-white/30 text-base md:text-lg font-light leading-relaxed max-w-xl mx-auto">
              And in that nothing, you'll find everything you forgot you had.
            </p>
          </div>

          {/* CTA */}
          <div
            className={`mt-16 transition-all duration-[2000ms] delay-500 ease-out ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <button
              onClick={() => navigate('/request-access')}
              className="group relative px-12 py-4 border border-white/20 hover:border-white/40 transition-all duration-500"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/70 group-hover:text-white transition-colors">
                Request Access
              </span>
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          </div>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-12 left-1/2 -translate-x-1/2 transition-all duration-[2000ms] delay-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/30">Scroll</span>
              <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
            </div>
          </div>
        </section>

        {/* Second Section - The Contradiction */}
        <section className="min-h-screen flex flex-col justify-center items-center px-8 py-24 bg-gradient-to-b from-transparent via-black/50 to-[#0a0a0a]">
          <div className="max-w-3xl text-center">

            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 block">
              The Contradiction
            </span>

            <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-white/80 leading-relaxed italic mb-12">
              "We offer nothing.<br />
              <span className="text-white/50">And that's everything.</span>"
            </blockquote>

            <div className="space-y-6 text-white/40 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
              <p>
                In a world optimized for stimulation, we curate its opposite.
              </p>
              <p>
                Private alpine sanctuaries. No itineraries. No networking events.
                No "experiences" designed for your Instagram.
              </p>
              <p className="text-white/60">
                Just silence. Space. And the Swiss Alps.
              </p>
            </div>

          </div>
        </section>

        {/* Third Section - For Who */}
        <section className="min-h-screen flex flex-col justify-center px-8 py-24 bg-[#0a0a0a]">
          <div className="max-w-6xl mx-auto w-full">

            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">

              {/* Left - Text */}
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

              {/* Right - Visual */}
              <div className="relative">
                <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                  <img
                    src="/images/villars-sunrise.jpg"
                    alt="Dents du Midi at sunrise, sea of clouds"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

                  {/* Overlay Text */}
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

        {/* Fourth Section - The Sanctuaries Preview */}
        <section className="py-24 px-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">

            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
              The Network
            </span>

            <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-12">
              Three sanctuaries. <span className="text-white/40 italic">One philosophy.</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">

              {/* Villars */}
              <div className="text-left p-6 border border-white/10 hover:border-white/20 transition-colors">
                <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/60 mb-2 block">
                  Active
                </span>
                <h3 className="font-serif text-xl text-white/80 mb-2">Villars</h3>
                <p className="text-white/40 text-sm">Swiss Alps</p>
              </div>

              {/* Verbier */}
              <div className="text-left p-6 border border-white/5 opacity-50">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2 block">
                  2027
                </span>
                <h3 className="font-serif text-xl text-white/50 mb-2">Verbier</h3>
                <p className="text-white/30 text-sm">Valais</p>
              </div>

              {/* Zermatt */}
              <div className="text-left p-6 border border-white/5 opacity-50">
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2 block">
                  2028
                </span>
                <h3 className="font-serif text-xl text-white/50 mb-2">Zermatt</h3>
                <p className="text-white/30 text-sm">Matterhorn</p>
              </div>

            </div>

            <p className="text-white/30 text-sm">
              Full details, availability, and member pricing visible after approval.
            </p>

          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-32 px-8 bg-[#0a0a0a] border-t border-white/5">
          <div className="max-w-2xl mx-auto text-center">

            <h2 className="font-serif text-4xl md:text-5xl text-white/90 mb-6">
              Switzerland is boring.
            </h2>

            <p className="text-white/40 text-lg mb-12">
              For those with all the dreams in the world.
            </p>

            <button
              onClick={() => navigate('/request-access')}
              className="group relative px-16 py-5 bg-white text-black hover:bg-white/90 transition-all duration-500"
            >
              <span className="text-[11px] uppercase tracking-[0.25em] font-medium">
                Request Access
              </span>
            </button>

            <p className="text-white/20 text-xs mt-8">
              Applications reviewed within 48 hours
            </p>

          </div>
        </section>

        {/* Footer - Minimal */}
        <footer className="py-12 px-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

            <div className="flex items-center gap-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                Swissperiences
              </span>
              <span className="text-white/10">|</span>
              <span className="text-[10px] text-white/20">
                Geneva, Switzerland
              </span>
            </div>

            <div className="flex items-center gap-8">
              <a
                href="https://instagram.com/swissperiences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://linkedin.com/company/swissperiences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors"
              >
                LinkedIn
              </a>
            </div>

            <span className="text-[10px] text-white/20">
              &copy; {new Date().getFullYear()}
            </span>

          </div>
        </footer>

      </main>
    </div>
  );
};

export default Index;
