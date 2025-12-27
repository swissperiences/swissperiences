import { HeroSection } from "@/components/ui/hero-section";
import WhatWeCurate from "@/components/WhatWeCurate";
import HowItWorks from "@/components/HowItWorks";


import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useState } from "react";

const Index = () => {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onJoinWaitlist={() => setIsWaitlistOpen(true)} />
      <WhatWeCurate />
      <HowItWorks />


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
