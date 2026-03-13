import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ScrollReveal } from "../components/ui/scroll-reveal";
import { ListingApplicationForm } from "../components/ListingApplicationForm";

const categories = [
    {
        title: "Boutique Properties",
        description:
            "Hotels, chalets, B&Bs, and apartments with character. If your property has a story, it belongs here.",
    },
    {
        title: "Activities & Guides",
        description:
            "Ski instructors, hiking guides, paragliding operators, wine tours, cooking classes. The people who make Switzerland come alive.",
    },
    {
        title: "Multi-Day Experiences",
        description:
            "Curated packages, wellness retreats, photography workshops, adventure itineraries. Complete journeys, not just moments.",
    },
    {
        title: "Local Experts",
        description:
            "Photographers, private chefs, wellness practitioners, sommeliers. The talent that elevates every experience.",
    },
];

export default function ListYourExperience() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "List Your Experience | Partner with Swissperiences",
        description:
            "List your property, activity, or experience on Switzerland's curated travel platform. Join a growing network of Swiss tourism partners.",
        provider: {
            "@type": "Organization",
            name: "Swissperiences",
            url: "https://www.swissperiences.ch",
        },
        areaServed: "Switzerland",
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="List Your Experience | Swissperiences"
                description="List your property, activity, or experience on Switzerland's curated travel platform. Join a growing network of Swiss tourism partners."
                keywords="list experience switzerland, swiss tourism partner, list property switzerland, tourism marketplace switzerland, partner with swissperiences"
                canonical="https://www.swissperiences.ch/list-your-experience"
                structuredData={structuredData}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/drone/lakeside-village-aerial.jpg"
                            alt="Swiss lakeside village from above"
                            className="w-full h-full object-cover brightness-[0.5] contrast-[1.1] saturate-[0.9]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 pt-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            List With Us
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-8"
                        >
                            Bring your Swiss experience
                            <br />
                            <span className="italic">to the world.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            Join a curated platform of properties, activities, and local
                            experts across Switzerland.
                        </motion.p>
                    </div>
                </section>

                {/* What We're Building */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                        <ScrollReveal>
                            <div>
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    The Vision
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight">
                                    Switzerland's curated
                                    <br />
                                    <span className="text-white/50 italic">
                                        travel platform.
                                    </span>
                                </h2>
                                <div className="space-y-6 text-white/60 font-light leading-relaxed">
                                    <p>
                                        Swissperiences is building the platform where
                                        travellers discover the best of Switzerland —
                                        not through algorithms, but through editorial
                                        curation and local expertise.
                                    </p>
                                    <p>
                                        We're looking for properties with character,
                                        guides with passion, and experience providers
                                        who care about quality. If that sounds like you,
                                        we'd love to hear from you.
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <div className="relative">
                                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 group">
                                    <img
                                        src="/images/drone/blausee-autumn-aerial.jpg"
                                        alt="Swiss alpine landscape"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-[0.85]"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-neutral-950 border border-white/10 px-6 py-4">
                                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] block mb-1">
                                        Covering
                                    </span>
                                    <span className="text-white font-serif text-lg">
                                        All of Switzerland
                                    </span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Why List With Us */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    Why List With Us
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif">
                                    More than a listing.
                                </h2>
                            </div>
                        </ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
                            <ScrollReveal delay={0.1}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        01
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        Curated Audience
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Travellers who actively seek premium Swiss
                                        experiences. Not mass tourism — engaged visitors
                                        who value quality and are ready to book.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        02
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        Beautiful Presentation
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Your experience presented with editorial-quality
                                        content, professional photography support, and
                                        a design standard that elevates your brand.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        03
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        Fair Partnership
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Transparent terms. No exclusivity required.
                                        We grow together — your success is our success.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* What We're Looking For */}
                <section className="py-24 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    Partners
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                    What we're
                                    <br />
                                    <span className="text-white/50 italic">
                                        looking for.
                                    </span>
                                </h2>
                            </div>
                        </ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            {categories.map((cat, index) => (
                                <ScrollReveal
                                    key={cat.title}
                                    delay={index * 0.08}
                                >
                                    <div className="border-l-2 border-switz-red/30 pl-8">
                                        <h3 className="text-xl font-serif text-white mb-3">
                                            {cat.title}
                                        </h3>
                                        <p className="text-white/50 font-light text-sm leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 md:py-32">
                    <div className="max-w-3xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    How It Works
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif">
                                    From application to bookings.
                                </h2>
                            </div>
                        </ScrollReveal>
                        <div className="space-y-16">
                            <ScrollReveal delay={0.1}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        01
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        Apply
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        Fill out the form below. Tell us what
                                        you offer and what makes it special.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        02
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        Review
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        We review every application personally.
                                        If there's a fit, we'll visit, photograph,
                                        and prepare your listing.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        03
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        List
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        Your experience goes live on our platform
                                        with beautiful editorial presentation and
                                        full SEO visibility.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.4}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        04
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        Earn
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        Receive bookings from engaged travellers.
                                        We handle the marketing and presentation —
                                        you deliver the experience.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Application Form */}
                <section className="py-24 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                            <ScrollReveal>
                                <div className="lg:sticky lg:top-32">
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                        Get Started
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">
                                        Ready to join?
                                    </h2>
                                    <p className="text-white/50 font-light leading-relaxed mb-8">
                                        Tell us about what you offer. We review every application personally and respond within a few days.
                                    </p>
                                    <div className="space-y-3 text-sm text-white/40">
                                        <p>No listing fees to apply.</p>
                                        <p>No exclusivity required.</p>
                                        <p>Keep full control of your business.</p>
                                    </div>
                                    <div className="mt-12 space-y-4 text-sm">
                                        <a
                                            href="mailto:hello@swissperiences.ch"
                                            className="text-white/40 hover:text-white transition-colors block"
                                        >
                                            hello@swissperiences.ch
                                        </a>
                                        <a
                                            href="https://wa.me/41787002202"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/40 hover:text-white transition-colors block"
                                        >
                                            WhatsApp →
                                        </a>
                                    </div>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <ListingApplicationForm />
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Cross-link to Partnerships */}
                <section className="border-t border-white/5 py-16 px-6 text-center">
                    <ScrollReveal>
                        <p className="text-white/40 font-light text-sm mb-4">
                            Looking for brand partnerships instead?
                        </p>
                        <Link
                            to="/partnerships"
                            className="text-switz-red text-xs uppercase tracking-[0.2em] font-bold hover:text-white transition-colors duration-300"
                        >
                            View brand partnerships →
                        </Link>
                    </ScrollReveal>
                </section>
            </main>

            <Footer />
        </div>
    );
}
