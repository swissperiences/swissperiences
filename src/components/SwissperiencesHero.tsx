import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-swiss-alps.jpg";

export default function SwissperiencesHero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cinematic aerial view of Swiss Alps with snow-capped mountains and alpine lakes at golden hour"
          className="h-full w-full object-cover animate-scale-in"
        />
        <div className="absolute inset-0 gradient-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 md:py-40">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground animate-fade-in">
            Swissperiences
          </p>

          <h1 className="text-4xl font-semibold leading-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up">
            Cinematic Swiss visuals,
            <br />
            captured from above.
          </h1>

          <p className="mt-6 text-lg text-subtle md:text-xl animate-fade-in-delayed">
            A curated library of premium drone footage showcasing Switzerland's
            landscapes — designed for brands, media, and storytelling.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 animate-fade-in-up-delayed">
            <Button variant="hero" size="xl">
              Explore the Collection
            </Button>
            <Button variant="heroOutline" size="xl">
              Request Licensing
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 border-t border-border pt-10 text-sm sm:grid-cols-3 animate-fade-in-up-delayed-2">
            <div>
              <p className="text-2xl font-semibold text-foreground">4K–8K</p>
              <p className="text-muted-foreground">Ultra-high resolution</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">Swiss-shot</p>
              <p className="text-muted-foreground">Original aerial content</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">Licensable</p>
              <p className="text-muted-foreground">Commercial ready</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
