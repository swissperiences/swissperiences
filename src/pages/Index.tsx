import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SEO from "@/components/SEO";
import { Founder } from "@/components/Founder";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import RequestQuoteForm from "@/components/RequestQuoteForm";
import WorldsSection from "@/components/home/WorldsSection";
import FlagshipSanctuary from "@/components/home/FlagshipSanctuary";
import SignatureJourneys from "@/components/home/SignatureJourneys";
import AudioJourneysPreview from "@/components/home/AudioJourneysPreview";
import GuestStories from "@/components/home/GuestStories";
import MySwissperiencesPreview from "@/components/home/MySwissperiencesPreview";
import SectionEyebrow from "@/components/home/SectionEyebrow";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useAuth } from "@/hooks/use-auth";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

/**
 * Homepage v2 — the umbrella-brand flatplan (docs/product/HOMEPAGE_V2_FLATPLAN.md):
 * 1 hero · 2 worlds · 3 flagship sanctuary · 4 signature journeys · 5 audio
 * journeys · 6 guest stories · 7 My Swissperiences · 8 the host · 9 final CTA.
 */
const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  const { isLoggedIn } = useAuth();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [quoteInterest, setQuoteInterest] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    if (prefersReducedMotion) return () => clearTimeout(timer);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prefersReducedMotion]);

  function scrollToQuote(packageId?: string) {
    if (packageId) setQuoteInterest(packageId);
    document.getElementById("request-quote")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function scrollToWorlds() {
    document.getElementById("worlds")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
      "logo": "https://www.swissperiences.ch/favicon-512x512.png",
      "description": "Private stays, alpine journeys, local stories and experiences across Switzerland — personally curated and personally hosted.",
      "founder": {
        "@type": "Person",
        "name": "Cauêh Vidal",
      },
      "foundingDate": "2024",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CH",
        "addressLocality": "Villars-sur-Ollon",
        "addressRegion": "Vaud",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@swissperiences.ch",
        "contactType": "reservations",
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
      "@type": "TravelAgency",
      "name": "Swissperiences",
      "url": "https://www.swissperiences.ch",
      "priceRange": "Contact for pricing",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Villars-sur-Ollon",
        "addressRegion": "Vaud",
        "addressCountry": "CH",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 46.3000,
        "longitude": 7.0556,
      },
      "areaServed": "Switzerland",
    },
  ];

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO canonical="https://www.swissperiences.ch/en" structuredData={structuredData} />

      {/* ════════════════════════════════════════
          1. HERO — Umbrella brand, full-screen video
      ════════════════════════════════════════ */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0"
          style={prefersReducedMotion ? undefined : { transform: `translateY(${scrollY * 0.2}px)` }}
        >
          {prefersReducedMotion ? (
            <img
              src="/videos/hero-poster.jpg"
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              autoPlay muted loop playsInline
              className="w-full h-full object-cover"
              poster="/videos/hero-poster.jpg"
            >
              <source src="/videos/hero-optimized.webm" type="video/webm" />
              <source src="/videos/hero-final.mp4" type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#060606]" />
        </div>

        <Navigation />

        <div className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 px-8 md:px-16 lg:px-24">
          <div
            className={`max-w-5xl transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <SectionEyebrow className="mb-6 text-white/60">
              {t("umbrellaHero.eyebrow")}
            </SectionEyebrow>
            <h1 className="font-serif text-[clamp(2.75rem,7vw,8rem)] leading-[0.9] tracking-tight">
              <span className="block text-white">{t("umbrellaHero.title1")}</span>
              <span className="block text-white italic">{t("umbrellaHero.title2")}</span>
            </h1>
            <p className="mt-6 text-white/60 text-base md:text-lg font-light max-w-md">
              {t("umbrellaHero.support")}
            </p>
          </div>

          <div
            className={`mt-10 flex flex-wrap items-center gap-4 md:gap-6 transition-all duration-1000 delay-300 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <button
              onClick={scrollToWorlds}
              className="px-10 py-4 bg-white text-black hover:bg-white/90 transition-all duration-500"
            >
              <span className="text-xs uppercase tracking-[0.25em] font-medium">
                {t("umbrellaHero.primaryCta")}
              </span>
            </button>
            <button
              onClick={() => navigate(isLoggedIn ? "/members" : "/login")}
              className="group px-8 py-4 border border-white/25 hover:border-glacier-500/40 hover:bg-white/5 transition-all duration-500"
            >
              <span className="text-xs uppercase tracking-[0.25em] text-white/60 group-hover:text-glacier-300 transition-colors">
                {t("umbrellaHero.secondaryCta")}
              </span>
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. THE SWISSPERIENCES WORLDS
      ════════════════════════════════════════ */}
      <WorldsSection />

      {/* ════════════════════════════════════════
          3. FLAGSHIP SANCTUARY — Villars
      ════════════════════════════════════════ */}
      <FlagshipSanctuary onPlanStay={() => scrollToQuote()} />

      {/* ════════════════════════════════════════
          4. THREE SIGNATURE JOURNEYS
      ════════════════════════════════════════ */}
      <SignatureJourneys onRequestJourney={(id) => scrollToQuote(id)} />

      {/* ════════════════════════════════════════
          5. AUDIO JOURNEYS — Stones & Water preview
      ════════════════════════════════════════ */}
      <AudioJourneysPreview />

      {/* ════════════════════════════════════════
          6. GUEST STORIES
      ════════════════════════════════════════ */}
      <GuestStories />

      {/* ════════════════════════════════════════
          7. MY SWISSPERIENCES
      ════════════════════════════════════════ */}
      <MySwissperiencesPreview />

      {/* ════════════════════════════════════════
          8. THE HOST
      ════════════════════════════════════════ */}
      <Founder />

      {/* ════════════════════════════════════════
          9. FINAL CTA — the conversation
      ════════════════════════════════════════ */}
      <section className="py-24 md:py-36 px-8 md:px-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-xl mx-auto text-center mb-14">
          <ScrollReveal variant="fade">
            <h2 className="font-serif text-4xl md:text-5xl text-white/90 leading-[1.05] mb-5">
              {t("finalCta.heading")}
            </h2>
            <p className="text-white/50 text-base md:text-lg font-light">
              {t("finalCta.support")}
            </p>
          </ScrollReveal>
        </div>
        <RequestQuoteForm embedded initialInterest={quoteInterest} />
        {!isLoggedIn && (
          <p className="text-center mt-12">
            <button
              onClick={() => navigate("/login")}
              className="inline-block py-3 text-xs uppercase tracking-[0.25em] text-white/35 hover:text-white/60 transition-colors"
            >
              {t("finalCta.signIn")}
            </button>
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
