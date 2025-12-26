import { HeroSection } from "@/components/ui/hero-section";
import Navigation from "@/components/Navigation";
import WhatWeCurate from "@/components/WhatWeCurate";
import HowItWorks from "@/components/HowItWorks";
import AnimatedStatCounter from "@/components/AnimatedStatCounter";
import CorporateRetreats from "@/components/CorporateRetreats";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useState } from "react";

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation onWaitlistClick={() => setIsWaitlistOpen(true)} />
      <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />
      <WhatWeCurate />
      <HowItWorks />
      <AnimatedStatCounter />
      <CorporateRetreats />
      <FAQ />
      <Footer />
      <WaitlistModal 
        open={isWaitlistOpen} 
        onOpenChange={setIsWaitlistOpen} 
      />
    </div>
  );
};

export default Index;
