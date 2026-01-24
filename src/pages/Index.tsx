import { lazy, Suspense, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeroSection } from "@/components/ui/hero-section";
import SEO from "@/components/SEO";
import GlobalVideoBackground from "@/components/GlobalVideoBackground";

// Lazy-loaded components for performance optimization
const UpcomingRetreats = lazy(() => import("@/components/UpcomingRetreats").then(m => ({ default: m.UpcomingRetreats })));
const Founder = lazy(() => import("@/components/Founder").then(m => ({ default: m.Founder })));
const JourneyTimeline = lazy(() => import("@/components/JourneyTimeline"));
const WhatWeCurate = lazy(() => import("@/components/WhatWeCurate"));
const Footer = lazy(() => import("@/components/Footer"));
const PhilosophySpacer = lazy(() => import("@/components/PhilosophySpacer"));
const WaitlistModal = lazy(() => import("@/components/WaitlistModal").then(m => ({ default: m.WaitlistModal })));

// Subtle loading spinner for components
const ComponentLoader = () => (
  <div className="w-full py-12 flex items-center justify-center">
    <div className="w-4 h-4 border-b-2 border-white/20 rounded-full animate-spin" />
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistTier, setWaitlistTier] = useState<string>("General Waitlist");
  const [waitlistIntent, setWaitlistIntent] = useState<string>("");

  const openWaitlist = (tier: string = "General Waitlist", intent: string = "") => {
    setWaitlistTier(tier);
    setWaitlistIntent(intent);
    setIsWaitlistOpen(true);
  };

  // Check for payment success
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      navigate('/success');
    }
  }, [navigate]);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Swissperiences",
    "url": "https://swissperiences.ch",
    "logo": "https://swissperiences.ch/favicon-512x512.png",
    "description": "Curated Swiss experiences for mindful travelers. From alpine peaks to artisan workshops—authentic experiences you won't find elsewhere.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CH",
      "addressLocality": "Geneva"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "addressCountry": "Switzerland"
    },
    "sameAs": [
      "https://instagram.com/swissperiences",
      "https://linkedin.com/company/swissperiences"
    ],
    "priceRange": "Premium",
    "availableLanguage": ["en"]
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO
        title="Swissperiences | Your Private Sanctuary in the Alps"
        description="A boutique home base in Villars-sur-Ollon curated by Caueh Vidal. Private alpine retreats and curated road journeys."
        keywords="swiss experiences, switzerland travel, alpine retreats, luxury switzerland, swiss alps, boutique host, authentic switzerland"
        canonical="https://swissperiences.ch"
        structuredData={structuredData}
      />
      {/* Global video background for entire page */}
      <GlobalVideoBackground />

      <main className="relative z-10">
        <HeroSection onJoinWaitlist={() => openWaitlist("General Waitlist")} />

        <Suspense fallback={<ComponentLoader />}>
          {/* 2. The Elements (Vibe) */}
          <WhatWeCurate onJoinWaitlist={openWaitlist} />

          <PhilosophySpacer />

          {/* 3. The Archives (Proof & Detail) */}
          <JourneyTimeline />

          {/* 5. The Host (Trust) */}
          <Founder />

          {/* 6. The Calendar (Access) */}
          <UpcomingRetreats onJoinWaitlist={(tier) => openWaitlist(tier, 'retreat')} />
        </Suspense>
      </main>

      <div className="relative z-10">
        <Suspense fallback={<ComponentLoader />}>
          <Footer />
        </Suspense>
      </div>

      <Suspense fallback={null}>
        <WaitlistModal
          open={isWaitlistOpen}
          onOpenChange={setIsWaitlistOpen}
          selectedTier={waitlistTier}
          intent={waitlistIntent}
        />
      </Suspense>
    </div>
  );
};

export default Index;

// Hard Reset Timestamp: 2026-01-24T01:55:00Z - Force Vercel Rebuild
