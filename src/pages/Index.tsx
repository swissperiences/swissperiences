import { HeroSection } from "@/components/ui/hero-section";
import WhatWeCurate from "@/components/WhatWeCurate";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import GlobalVideoBackground from "@/components/GlobalVideoBackground";
import SEO from "@/components/SEO";
// import AnimatedStatCounter from "@/components/AnimatedStatCounter"; // Removed: Stats feel achievement-oriented, not aligned with quiet luxury positioning
import { useState } from "react";

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

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
        title="Swissperiences | Curated Swiss Experiences for Mindful Travelers"
        description="From alpine peaks to artisan workshops—authentic Swiss experiences you won't find elsewhere. Launching Spring 2026."
        keywords="swiss experiences, switzerland travel, alpine retreats, luxury switzerland, swiss alps, mindful travel, authentic switzerland, curated experiences"
        canonical="https://swissperiences.ch"
        structuredData={structuredData}
      />
      {/* Global video background for entire page */}
      <GlobalVideoBackground />

      {/* All content with relative positioning */}
      <div className="relative z-10">
        <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />
        <WhatWeCurate />
        {/* AnimatedStatCounter removed - stats contradict Maison-level positioning */}
        <HowItWorks />
        <FAQ />
        <Footer />
      </div>

      <WaitlistModal
        open={isWaitlistOpen}
        onOpenChange={setIsWaitlistOpen}
      />
    </div>
  );
};

export default Index;
