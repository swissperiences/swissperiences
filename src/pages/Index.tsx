import { HeroSection } from "@/components/ui/hero-section";
import WhatWeCurate from "@/components/WhatWeCurate";
import HowItWorks from "@/components/HowItWorks";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import GlobalVideoBackground from "@/components/GlobalVideoBackground";
// import AnimatedStatCounter from "@/components/AnimatedStatCounter"; // Removed: Stats feel achievement-oriented, not aligned with quiet luxury positioning
import { useState } from "react";

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background relative">
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
