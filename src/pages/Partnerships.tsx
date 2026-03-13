import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import SEO from "../components/SEO";
import { ScrollReveal } from "../components/ui/scroll-reveal";
import { PartnershipInquiryForm } from "../components/PartnershipInquiryForm";

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
        title: "Corporate & Team Experiences",
        description:
            "Integrate retreat programming into your leadership development offering. We handle the Alps, you handle the agenda.",
    },
    {
        title: "Lifestyle & Concierge Services",
        description:
            "White-label access to our Swiss network for your most discerning clients. Seamless and fully managed.",
    },
];

export default function Partnerships() {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Brand Partnerships | Swissperiences",
        description:
            "Strategic partnerships with premium brands and organizations across Switzerland.",
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
                title="Brand Partnerships | Swissperiences"
                description="We build strategic partnerships with brands that share our standards. Private banking, luxury brands, real estate, corporate, and concierge services."
                keywords="swissperiences partnerships, luxury partnerships switzerland, private banking experiences, family office switzerland, luxury brand partnerships"
                canonical="https://www.swissperiences.ch/partnerships"
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
                            Brand Partnerships
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
                            We build strategic partnerships with brands that share
                            our standards for quality and authenticity.
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
                                    A curated platform.
                                    <br />
                                    <span className="text-white/50 italic">
                                        By design.
                                    </span>
                                </h2>
                                <div className="space-y-6 text-white/60 font-light leading-relaxed">
                                    <p>
                                        Swissperiences is a curated travel platform
                                        connecting travellers with the best alpine
                                        sanctuaries, experiences, and local experts
                                        across Switzerland. We serve people who value
                                        precision, authenticity, and beauty above
                                        all else.
                                    </p>
                                    <p>
                                        Founded in Geneva, we operate at the
                                        intersection of hospitality, adventure,
                                        and editorial curation. Every detail is
                                        personal. Every experience is vetted.
                                        Every partner is chosen with care.
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
                                    The Platform
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif">
                                    Why brands partner with us.
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
                                        Engaged Audience
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Our travellers actively seek premium Swiss
                                        experiences. They don't stumble in from ads —
                                        they come with intent and trust our curation.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.2}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        02
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        Curated Quality
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        Every experience and partner on our platform
                                        is personally vetted. Your brand sits alongside
                                        quality, never alongside noise.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <ScrollReveal delay={0.3}>
                                <div className="space-y-4">
                                    <div className="text-4xl text-white/10 font-serif italic">
                                        03
                                    </div>
                                    <h3 className="text-xl font-serif">
                                        High Standards, Real Relationships
                                    </h3>
                                    <p className="text-white/50 font-light text-sm leading-relaxed">
                                        We operate with intention. A focused number
                                        of brand partnerships, each deeply integrated
                                        into the experience. Meaningful alignment
                                        over empty impressions.
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
                                    Built for brands
                                    <br />
                                    <span className="text-white/50 italic">
                                        that belong.
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
                                        tailored to your brand and audience. No
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
                                        The best partnerships are built on trust
                                        and grow over time. We measure success in
                                        impact, not impressions.
                                    </p>
                                </div>
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Inquiry Form */}
                <section className="py-24 md:py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-start">
                            <ScrollReveal>
                                <div className="lg:sticky lg:top-32">
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-4">
                                        Get in Touch
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif mb-6 leading-tight">
                                        Let's explore this
                                        <br />
                                        <span className="text-white/50 italic">together.</span>
                                    </h2>
                                    <p className="text-white/50 font-light leading-relaxed mb-8">
                                        Partnerships begin with a conversation. Tell us about your brand and we'll get back to you with ideas.
                                    </p>
                                    <div className="space-y-4 text-sm">
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
                                <PartnershipInquiryForm />
                            </ScrollReveal>
                        </div>
                    </div>
                </section>

                {/* Cross-link to Listing */}
                <section className="border-t border-white/5 py-16 px-6 text-center">
                    <ScrollReveal>
                        <p className="text-white/40 font-light text-sm mb-4">
                            Own a property or run an activity in Switzerland?
                        </p>
                        <Link
                            to="/list-your-experience"
                            className="text-switz-red text-xs uppercase tracking-[0.2em] font-bold hover:text-white transition-colors duration-300"
                        >
                            List your experience on Swissperiences →
                        </Link>
                    </ScrollReveal>
                </section>
            </main>

            <Footer />
        </div>
    );
}
