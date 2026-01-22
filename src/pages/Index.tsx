import { HeroSection } from "@/components/ui/hero-section";
import WhatWeCurate from "@/components/WhatWeCurate";
import PhilosophySpacer from "@/components/PhilosophySpacer";
import HowItWorks from "@/components/HowItWorks";
import JourneyTimeline from "@/components/JourneyTimeline";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import GlobalVideoBackground from "@/components/GlobalVideoBackground";
import SEO from "@/components/SEO";
import { Mentors } from "@/components/Mentors";
import { Founder } from "@/components/Founder";
import { UpcomingRetreats } from "@/components/UpcomingRetreats";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistTier, setWaitlistTier] = useState<string>("General Waitlist");

  const openWaitlist = (tier: string = "General Waitlist") => {
    setWaitlistTier(tier);
    setIsWaitlistOpen(true);
  };

  // Check for payment success
  const { toast } = useToast();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      toast({
        title: "Deposit Confirmed",
        description: "Welcome to Swissperiences. We will be in touch shortly.",
        duration: 6000,
      });
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
        <HeroSection onJoinWaitlist={() => openWaitlist("General Waitlist")} />
        <PhilosophySpacer />
        <UpcomingRetreats onJoinWaitlist={(tier) => openWaitlist(tier)} />
        <Mentors />
        <Founder />
        <JourneyTimeline />
        <WhatWeCurate />
        <HowItWorks />
        <FAQ />
        <Footer />
      </div>

      <WaitlistModal
        open={isWaitlistOpen}
        onOpenChange={setIsWaitlistOpen}
        selectedTier={waitlistTier}
      />
    </div>
  );
};

export default Index;
