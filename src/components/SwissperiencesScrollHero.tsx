import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeroSection } from "@/components/ui/hero-section";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Toaster } from "@/components/ui/toaster";
import { NotificationBanner } from "@/components/NotificationBanner";
// import Navigation from "@/components/Navigation";
import AnimatedStatCounter from "@/components/AnimatedStatCounter";
import TrustedBy from "@/components/TrustedBy";
import WhatWeCurate from "@/components/WhatWeCurate";
import HowItWorks from "@/components/HowItWorks";
import CorporateRetreats from "@/components/CorporateRetreats";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

const SwissperiencesContent = ({ onWaitlist }: { onWaitlist: () => void }) => {
  return (
    <div className="bg-background">
      <AnimatedStatCounter />
      {/* TrustedBy hidden until logos are finalized */}
      {/* <TrustedBy /> */}
      <WhatWeCurate />

      <div className="max-w-4xl mx-auto space-y-32 py-32 px-6">
        {/* Philosophy */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-10">
            Philosophy
          </p>
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed italic text-foreground/90">
            Switzerland is not a destination.
            <br />
            <span className="text-foreground">It's a state of mind.</span>
          </blockquote>
        </motion.section>

        {/* Beliefs */}
        <section>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-12 text-center">
            What We Believe
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8 text-center">
            {["Silence", "Nature", "Slowness", "Presence", "Connection", "Precision"].map(
              (pillar) => (
                <p key={pillar} className="text-xl font-medium">
                  {pillar}
                </p>
              )
            )}
          </div>
        </section>

        {/* What It Is */}
        <section className="text-center space-y-8">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Offline is the new luxury
          </p>

          <p className="text-lg leading-relaxed max-w-2xl mx-auto text-subtle">
            Swissperiences designs offline experiences in nature for people who need
            less stimulation and more feeling.
          </p>

          <p className="text-base text-muted-foreground/80 max-w-xl mx-auto">
            Designed for people who are overstimulated, not uninspired.
          </p>

          <p className="text-lg leading-relaxed max-w-2xl mx-auto text-subtle">
            No screens. No performance. No content creation. No noise.
            <br />
            Just being.
          </p>
        </section>

        {/* Experiences */}
        <section>
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-12 text-center">
            Offline Experiences
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            {["Water", "Breath", "Silence", "Community", "Nature"].map((exp) => (
              <p key={exp} className="text-lg">
                {exp}
              </p>
            ))}
          </div>
        </section>

      </div>

      <HowItWorks />

      <CorporateRetreats />

      <FAQ />

      {/* Final CTA */}
      <section className="bg-background text-center space-y-8 py-32 px-6">
        <p className="text-4xl font-semibold text-foreground">Swissperiences</p>
        <p className="text-muted-foreground text-lg">A pause — designed.</p>

        <button
          onClick={onWaitlist}
          className="mt-8 inline-block rounded-xl bg-white text-black px-10 py-5 text-sm uppercase tracking-widest font-medium hover:bg-white/90 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background w-full sm:w-auto"
          aria-label="Get early access to Swissperiences"
        >
          Get Early Access
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default function SwissperiencesScrollHero() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection onJoinWaitlist={() => setWaitlistOpen(true)} />

      <SwissperiencesContent onWaitlist={() => setWaitlistOpen(true)} />

      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />
      <NotificationBanner onJoinNow={() => setWaitlistOpen(true)} />
      <Toaster />
    </div>
  );
}
