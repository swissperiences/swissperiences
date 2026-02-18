import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ScrollReveal } from "../components/ui/scroll-reveal";

const partnershipTypes = [
    {
        title: "Private Banking & Family Offices",
        description:
            "Offer your clients access to Switzerland beyond the portfolio. Curated alpine retreats as a relationship touchpoint.",
    },
    {
        title: "Luxury Watchmakers & Maisons",
        description:
            "Intimate brand experiences set against the Swiss Alps. Private viewings, client dinners, and bespoke moments.",
    },
    {
        title: "Premium Real Estate",
        description:
            "Connect international buyers with the Swiss lifestyle. Property tours interwoven with curated alpine experiences.",
    },
    {
        title: "Hotels & Hospitality",
        description:
            "Extend your guest experience with seamless off-property adventures. Guided journeys, private chefs, cinematic documentation.",
    },
    {
        title: "Corporate & Team Experiences",
        description:
            "Integrate retreat programming into your leadership development offering. We handle the Alps, you handle the agenda.",
    },
    {
        title: "Lifestyle & Concierge Services",
        description:
            "White-label access to our Swiss network for your most discerning clients. Discreet, seamless, and fully managed.",
    },
    {
        title: "Private Chalets & Second Homes",
        description:
            "We partner with a select number of private owners whose homes naturally belong in this world. We help turn your chalet or second home into a quiet, quietly profitable alpine retreat — curating guest experience, handling operations and refining positioning, while you retain full ownership and control. We don't manage properties at scale; we choose a handful, and treat each one as if it were our own.",
    },
];

export default function Partnerships() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Partnerships | Swissperiences",
        description:
            "Strategic partnerships with luxury brands and organizations across Switzerland.",
        provider: {
            "@type": "Organization",
            name: "Swissperiences",
            url: "https://swissperiences.ch",
        },
        areaServed: "Switzerland",
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Partnerships | Swissperiences"
                description="We build discreet partnerships with those who serve the world's most discerning individuals. Private banking, luxury brands, real estate, and hospitality."
                keywords="swissperiences partnerships, luxury partnerships switzerland, private banking experiences, family office switzerland, luxury brand partnerships"
                canonical="https://swissperiences.ch/partnerships"
                structuredData={structuredData}
            />
            <Navigation />

            <main>
                {/* Hero Section */}
                <section className="relative h-[70vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="/images/drone/geneva-jet-deau-aerial.jpg"
                            alt="Aerial view of Geneva and Jet d'Eau"
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
                            Private Partnerships
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-serif text-white mb-8"
                        >
                            The Right People,
                            <br />
                            the Right Places.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-2xl mx-auto text-white/60 font-light text-lg"
                        >
                            We build discreet partnerships with those who serve
                            the world's most discerning individuals.
                        </motion.p>
                    </div>
                </section>

                {/* Who We Are — Brief Positioning */}
                <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                        <ScrollReveal>
                            <div>
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    Who We Are
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif mb-8 leading-tight">
                                    A private network.
                                    <br />
                                    <span className="text-white/50 italic">
                                        By invitation.
                                    </span>
                                </h2>
                                <div className="space-y-6 text-white/60 font-light leading-relaxed">
                                    <p>
                                        Swissperiences is a members-only network
                                        of curated alpine sanctuaries and
                                        experiences across Switzerland. We serve
                                        a small, carefully selected clientele of
                                        individuals and families who value
                                        privacy, precision, and authenticity
                                        above all else.
                                    </p>
                                    <p>
                                        Founded in Geneva, we operate at the
                                        intersection of hospitality, adventure,
                                        and discretion. Every detail is
                                        personal. Every experience is bespoke.
                                        Every member is known by name.
                                    </p>
                                    <p>
                                        We also partner with a handful of
                                        private owners whose homes naturally
                                        belong in this world — turning quiet
                                        properties into curated sanctuaries.
                                    </p>
                                </div>
                                <Link
                                    to="/about"
                                    className="inline-block mt-8 text-switz-red text-xs uppercase tracking-[0.2em] font-bold hover:text-white transition-colors duration-300"
                                >
                                    Learn more about our story →
                                </Link>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={0.2}>
                            <div className="relative">
                                <div className="aspect-[4/5] overflow-hidden rounded-sm bg-neutral-900 group">
                                    <img
                                        src="/images/drone/villars-autumn-sunset.jpg"
                                        alt="Villars-sur-Ollon at sunset"
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-[0.85]"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute -bottom-6 -left-6 bg-neutral-950 border border-white/10 px-6 py-4">
                                    <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] block mb-1">
                                        Based in
                                    </span>
                                    <span className="text-white font-serif text-lg">
                                        Geneva, Switzerland
                                    </span>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </section>

                {/* The Network — Value Pillars */}
                <section className="bg-white/[0.02] border-y border-white/5 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    The Network
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif">
                                    Access a world that doesn't advertise.
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
                                        Curated Clientele
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Our members are founders, executives,
                                        and families who choose Switzerland for
                                        its silence, not its scenery. They don't
                                        search for luxury — it comes to them
                                        through trusted recommendations.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        02
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        Invitation Only
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Every member is personally vetted. There
                                        is no public booking. No marketplace. No
                                        algorithm. This means your brand is
                                        presented only to those who belong.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        03
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        High-Touch, Low-Volume
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        We operate with intention, not scale. A
                                        small number of partnerships, each
                                        deeply integrated into the experience.
                                        No banner ads. No affiliate links. Just
                                        quiet, meaningful alignment.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Partnership Categories */}
                <section className="py-24 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <ScrollReveal>
                            <div className="text-center mb-16">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                    Collaboration
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                    Built for alignment,
                                    <br />
                                    <span className="text-white/50 italic">
                                        not volume.
                                    </span>
                                </h2>
                            </div>
                        </ScrollReveal>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                            {partnershipTypes.map((type, index) => (
                                <ScrollReveal
                                    key={type.title}
                                    delay={index * 0.08}
                                >
                                    <div className="border-l-2 border-switz-red/30 pl-8">
                                        <h3 className="text-xl font-serif text-white mb-3">
                                            {type.title}
                                        </h3>
                                        <p className="text-white/50 font-light text-sm leading-relaxed">
                                            {type.description}
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
                                    The Approach
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif">
                                    Simple. Personal. Swiss.
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
                                        A Conversation
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        It starts with a call or a coffee in
                                        Geneva. We learn what you do, who you
                                        serve, and whether there is a natural
                                        fit.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        02
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        A Concept
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        We propose a collaboration framework
                                        tailored to your brand and clientele. No
                                        templates. No one-size-fits-all.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}>
                                <div className="text-center">
                                    <div className="text-4xl text-white/10 font-serif italic mb-4">
                                        03
                                    </div>
                                    <h3 className="text-xl font-serif mb-3">
                                        A Relationship
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed max-w-md mx-auto">
                                        The best partnerships are quiet and
                                        long-lasting. We measure success in
                                        trust, not transactions.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-6 text-center border-t border-white/5">
                    <ScrollReveal>
                        <div className="max-w-2xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-serif mb-6">
                                Let's explore this together.
                            </h2>
                            <p className="text-white/50 font-light mb-12">
                                Partnerships begin with a conversation.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <a
                                    href="mailto:hello@swissperiences.ch"
                                    className="inline-block bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                                >
                                    Get in Touch
                                </a>
                                <a
                                    href="https://wa.me/41787002202"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-switz-red text-xs uppercase tracking-[0.2em] font-bold hover:text-white transition-colors duration-300"
                                >
                                    Message on WhatsApp →
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>
            </main>

            <Footer />
        </div>
    );
}
