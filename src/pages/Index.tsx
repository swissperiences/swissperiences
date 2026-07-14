import { useEffect, useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import SEO from "@/components/SEO";
import { Founder } from "@/components/Founder";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsletterForm from "@/components/NewsletterForm";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
};

/* Journey 001 — facts sourced from the app (lib/genevaJourney.ts) */
const chapters = [
  { n: "01", title: "The Flower Clock", place: "Jardin Anglais" },
  { n: "02", title: "Place du Molard", place: "The harbour that became a square" },
  { n: "03", title: "Place du Bourg-de-Four", place: "Geneva's oldest square" },
  { n: "04", title: "Cathédrale Saint-Pierre", place: "Two thousand years underfoot" },
  { n: "05", title: "Maison Tavel", place: "The oldest house in the city" },
  { n: "06", title: "La Treille", place: "The world's longest wooden bench" },
  { n: "07", title: "The Reformation Wall", place: "Parc des Bastions" },
];

/* Minimal audio player for the narration preview */
const AudioPreview = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const format = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  return (
    <div className="border border-white/10 bg-white/[0.02] p-8 md:p-10">
      <audio
        ref={audioRef}
        src="/audio/geneva-chapter-1-preview.mp3"
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div className="flex items-center gap-6">
        <button
          onClick={toggle}
          aria-label={playing ? "Pause preview" : "Play preview"}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/20 hover:border-glacier-500/40 hover:bg-white/5 flex items-center justify-center flex-shrink-0 transition-all duration-500"
        >
          {playing
            ? <Pause size={22} className="text-white" />
            : <Play size={22} className="text-white ml-1" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] uppercase tracking-[0.4em] text-glacier-500/60 mb-1">
            Chapter 01 — Preview
          </p>
          <p className="font-serif text-xl md:text-2xl text-white/90 mb-4 truncate">
            The Flower Clock
          </p>
          <div
            className="h-px bg-white/10 relative cursor-pointer group py-2 -my-2 bg-clip-content"
            onClick={seek}
            role="slider"
            aria-label="Seek preview audio"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(progress)}
          >
            <div
              className="absolute top-2 left-0 h-px bg-glacier-400 transition-[width] duration-200"
              style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
            />
          </div>
          <div className="flex justify-between mt-3 text-[10px] text-white/30 tracking-widest">
            <span>{format(progress)}</span>
            <span>{format(duration)}</span>
          </div>
        </div>
      </div>
      <p className="text-white/30 text-xs font-light leading-relaxed mt-8 max-w-md">
        Recorded narration from the journey — this chapter plays as you stand
        at the Horloge Fleurie, looking out at the Jet d'Eau.
      </p>
    </div>
  );
};

const Index = () => {
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
        { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return { ref, visible };
  };

  const s1 = useScrollReveal(); // Statement
  const s2 = useScrollReveal(); // Journey 001
  const s3 = useScrollReveal(); // Chapters
  const s4 = useScrollReveal(); // How it works
  const s5 = useScrollReveal(); // Preview
  const s6 = useScrollReveal(); // Waitlist
  const s7 = useScrollReveal(); // Final CTA

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
      "logo": "https://www.swissperiences.ch/favicon-512x512.png",
      "description": "Cinematic audio journeys through Switzerland — GPS-guided walks that tell each city's story in the exact place it happened.",
      "founder": {
        "@type": "Person",
        "name": "Cauêh Vidal",
      },
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CH",
        "addressLocality": "Geneva",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@swissperiences.ch",
        "contactType": "customer support",
        "availableLanguage": ["English", "Portuguese", "French"],
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
      "@type": "MobileApplication",
      "name": "Swissperiences",
      "operatingSystem": "iOS",
      "applicationCategory": "TravelApplication",
      "description": "GPS-guided cinematic audio journeys through Switzerland. First journey: Stones & Water — Geneva Old Town, seven chapters from the Flower Clock to the Reformation Wall.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO
        title="Swissperiences | Cinematic Audio Journeys Through Switzerland"
        description="GPS-guided audio walks that tell Switzerland's story where it happened. Journey 001: Stones & Water — Geneva Old Town. Seven chapters, 1.9 km, one hour."
        keywords="audio guide Switzerland, Geneva walking tour, audio journey, GPS audio walk, Geneva old town, self-guided tour Switzerland"
        canonical="https://www.swissperiences.ch/en"
        structuredData={structuredData}
      />

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
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 block mb-8">
              Cinematic audio journeys — Switzerland
            </span>
            <h1 className="font-serif text-[clamp(3rem,8vw,9rem)] leading-[0.85] tracking-tight">
              <span className="block text-white">Walk into</span>
              <span className="block text-white">the story.</span>
              <span className="block mt-2 text-white/40 italic text-[clamp(2rem,4.5vw,5rem)]">Told where it happened.</span>
            </h1>
          </div>

          <div
            className={`mt-12 flex flex-wrap items-center gap-4 md:gap-8 transition-all duration-[2500ms] delay-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <button
              onClick={() => scrollToId("journey")}
              className="group px-10 py-4 bg-white text-black hover:bg-white/90 transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] font-medium">
                Journey 001 — Geneva
              </span>
            </button>
            <button
              onClick={() => scrollToId("preview")}
              className="group px-8 py-4 border border-white/20 hover:border-glacier-500/40 hover:bg-white/5 transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-glacier-300 transition-colors">
                Listen to a Preview
              </span>
            </button>
            <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-white/40">
              GPS-guided walks — one story at a time
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
          2. STATEMENT
      ════════════════════════════════════════ */}
      <section
        ref={s1.ref}
        className={`py-20 md:py-32 px-8 md:px-16 bg-[#060606] transition-all duration-[1500ms] ease-out ${s1.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-5xl mx-auto">
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-white/80 leading-[1.1] tracking-tight">
            We don't do guided tours.
            <span className="text-white/40 italic"> We tell the city's story — in the exact place it happened.</span>
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. JOURNEY 001 — Stones & Water
      ════════════════════════════════════════ */}
      <section
        id="journey"
        ref={s2.ref}
        className={`relative transition-all duration-[1500ms] ease-out ${s2.visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="relative h-[70vh] md:h-screen overflow-hidden">
          <img
            src="/images/drone/geneva-jet-deau-aerial.jpg"
            sizes="100vw"
            alt="Aerial view of the Jet d'Eau and Lake Geneva"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

          {/* Asymmetric text overlay */}
          <div className="absolute inset-0 flex items-end md:items-center px-8 md:px-16 lg:px-24 pb-16 md:pb-0">
            <div className="max-w-lg">
              <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-6">
                Journey 001 — Geneva Old Town
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white leading-[0.9] mb-6">
                Stones &<br />Water.
              </h2>
              <p className="text-white/50 text-base md:text-lg font-light leading-relaxed mb-4 max-w-sm">
                From the Flower Clock to the Reformation Wall — seven chapters
                through the old town. A harbour that became a square, a cathedral
                hiding two thousand years underfoot, and the gentlest law in Europe.
              </p>
              <p className="text-white/40 text-xs mb-8 tracking-wide">
                7 chapters · 1.9 km · ~60 min · Starts at the Jardin Anglais
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => scrollToId("preview")}
                  className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-glacier-300 transition-colors border-b border-white/20 hover:border-glacier-500/40 pb-1"
                >
                  Listen to a Preview
                </button>
                <button
                  onClick={() => scrollToId("waitlist")}
                  className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-glacier-300 transition-colors border-b border-white/20 hover:border-glacier-500/40 pb-1"
                >
                  Join the Waitlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. CHAPTERS
      ════════════════════════════════════════ */}
      <section
        ref={s3.ref}
        className={`py-24 md:py-32 px-8 md:px-16 lg:px-24 bg-[#060606] transition-all duration-[1500ms] ease-out ${s3.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-4xl mx-auto">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-12">
            The Route
          </span>
          <div className="divide-y divide-white/5 border-y border-white/5">
            {chapters.map((c) => (
              <div key={c.n} className="flex items-baseline gap-6 md:gap-10 py-5 group">
                <span className="text-[10px] tracking-[0.3em] text-glacier-500/60 font-medium w-8 flex-shrink-0">
                  {c.n}
                </span>
                <span className="font-serif text-xl md:text-2xl text-white/80 group-hover:text-white transition-colors">
                  {c.title}
                </span>
                <span className="hidden md:block ml-auto text-xs text-white/30 font-light text-right">
                  {c.place}
                </span>
              </div>
            ))}
          </div>
          <p className="text-white/30 text-xs font-light mt-8">
            Each chapter begins on its own — triggered by where you stand.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. HOW IT WORKS
      ════════════════════════════════════════ */}
      <section
        ref={s4.ref}
        className={`py-24 md:py-40 px-8 md:px-16 lg:px-24 bg-black border-y border-white/5 transition-all duration-[1500ms] ease-out ${s4.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-6xl mx-auto">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-16">
            How It Works
          </span>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-glacier-500/60 mb-6">01</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white/90 mb-4">Choose a journey</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">
                Download it once. Everything works offline from there — no roaming,
                no signal anxiety.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] text-glacier-500/60 mb-6">02</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white/90 mb-4">Walk at your own pace</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">
                No group, no schedule. Your position unlocks the next chapter as
                you reach each place — phone in your pocket, screen off.
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.3em] text-glacier-500/60 mb-6">03</p>
              <h3 className="font-serif text-2xl md:text-3xl text-white/90 mb-4">Listen where it happened</h3>
              <p className="text-sm text-white/40 font-light leading-relaxed">
                The story of each place, told while you stand in it. Cinematic
                narration, researched and produced in Switzerland.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. AUDIO PREVIEW
      ════════════════════════════════════════ */}
      <section
        id="preview"
        ref={s5.ref}
        className={`py-24 md:py-40 px-8 md:px-16 lg:px-24 bg-[#060606] transition-all duration-[1500ms] ease-out ${s5.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-6">
            Hear It
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-white/90 mb-12 leading-[0.95]">
            One minute of Geneva.
          </h2>
          <AudioPreview />
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. WAITLIST — App status
      ════════════════════════════════════════ */}
      <section
        id="waitlist"
        ref={s6.ref}
        className={`relative py-32 md:py-48 overflow-hidden transition-all duration-[1500ms] ease-out ${s6.visible ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0">
          <img
            src="/images/geneva-jet.jpg"
            sizes="100vw"
            alt="Jet d'Eau, Geneva"
            className="w-full h-full object-cover opacity-30"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-[#060606]/60" />
        </div>

        <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-4xl">
          <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-10">
            Coming to the App Store
          </span>

          <div className="space-y-6">
            <p className="font-serif text-3xl md:text-5xl text-white/70 leading-[1.1]">
              Journey 001 is in final testing.
            </p>
            <p className="font-serif text-3xl md:text-5xl text-white/40 leading-[1.1]">
              Geneva first. More cities follow.
            </p>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 max-w-md">
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Join the list to be first through the door when it launches —
              quiet updates only, no spam. Partner voucher codes will redeem
              directly in the app.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          8. THE MAKER — Founder
      ════════════════════════════════════════ */}
      <Founder />

      {/* ════════════════════════════════════════
          9. FINAL CTA
      ════════════════════════════════════════ */}
      <section
        ref={s7.ref}
        className={`py-40 md:py-56 px-8 bg-[#060606] transition-all duration-[1500ms] ease-out ${s7.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-5xl md:text-7xl text-white/90 mb-8 leading-[0.9]">
            The story is waiting.
          </h2>

          <p className="text-white/40 text-lg mb-16 font-light">
            Seven chapters through Geneva's old town — and that's just the first walk.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <button
              onClick={() => scrollToId("waitlist")}
              className="group px-16 py-5 bg-white text-black hover:bg-white/90 transition-all duration-500"
            >
              <span className="text-[11px] uppercase tracking-[0.3em] font-medium">
                Join the Waitlist
              </span>
            </button>
            <button
              onClick={() => scrollToId("preview")}
              className="group px-10 py-5 border border-white/20 hover:border-glacier-500/40 hover:bg-white/5 transition-all duration-500"
            >
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 group-hover:text-glacier-300 transition-colors">
                Listen to a Preview
              </span>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
