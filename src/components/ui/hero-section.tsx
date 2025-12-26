'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

// Import logos
// import ubsLogo from '@/assets/logos/ubs-logo.png';
// import franckMullerLogo from '@/assets/logos/franck-muller-logo.png';
// import ssbmGenevaLogo from '@/assets/logos/ssbm-geneva-logo.png';
// import franckProvostLogo from '@/assets/logos/franck-provost-logo.png';

interface SwissperiencesHeroSectionProps {
  onJoinWaitlist?: () => void;
}

export function HeroSection({ onJoinWaitlist }: SwissperiencesHeroSectionProps) {
  return (
    <main className="overflow-hidden bg-background">
      <section>
        <div className="relative pt-32 md:pt-44 pb-20">
          {/* Subtle gradient glow - dark theme */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/5 to-transparent blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 text-xs uppercase tracking-[0.25em] text-muted-foreground font-medium"
              >
                Premium Swiss Experiences
              </motion.p>

              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl text-foreground leading-[1.1] tracking-tight"
              >
                Cinematic Swiss visuals,
                <br />
                <span className="text-muted-foreground">captured from above.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-8 max-w-xl text-lg text-muted-foreground leading-relaxed"
              >
                A curated library of premium drone footage showcasing Switzerland's
                landscapes — designed for brands, media, and storytelling.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-12 flex flex-wrap justify-center gap-4"
              >
                <Button
                  variant="hero"
                  size="xl"
                  onClick={onJoinWaitlist}
                  className="group"
                >
                  <span>Explore the Collection</span>
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  variant="heroOutline"
                  size="xl"
                  onClick={onJoinWaitlist}
                >
                  <span>Request Licensing</span>
                </Button>
              </motion.div>

              {/* Stats row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-20 grid grid-cols-3 gap-8 border-t border-border/50 pt-10"
              >
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">4K–8K</p>
                  <p className="text-sm text-muted-foreground mt-1">Ultra-high resolution</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">Swiss-shot</p>
                  <p className="text-sm text-muted-foreground mt-1">Original aerial content</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-semibold text-foreground">Licensable</p>
                  <p className="text-sm text-muted-foreground mt-1">Commercial ready</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Trusted By Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative mx-auto mt-24 max-w-4xl px-6"
          >
            <p className="text-center text-xs uppercase tracking-[0.2em] text-muted-foreground mb-8">
              Trusted by leading brands
            </p>

            <div className="relative overflow-hidden py-4">
              {/* <InfiniteSlider gap={80} duration={30}>
                <img
                  className="mx-auto h-6 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                  src={ubsLogo}
                  alt="UBS"
                />
                <img
                  className="mx-auto h-8 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                  src={franckMullerLogo}
                  alt="Franck Muller"
                />
                <img
                  className="mx-auto h-10 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                  src={ssbmGenevaLogo}
                  alt="SSBM Geneva"
                />
                <img
                  className="mx-auto h-6 w-auto opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 invert"
                  src={franckProvostLogo}
                  alt="Franck Provost"
                />
              </InfiniteSlider>

              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-24"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-24"
                direction="right"
                blurIntensity={1}
              /> */}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
