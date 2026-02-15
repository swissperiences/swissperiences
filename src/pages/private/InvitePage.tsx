import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Mountain, Flame, Camera, Clock, Users, ChevronRight, BookOpen, Sun, Car } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "@/components/SEO";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

// ─── Invite Config Types ─────────────────────────────────────────────────────

interface InviteItineraryItem {
    icon: React.ReactNode;
    label: string;
    title: string;
    description: string;
    image?: string;
}

interface InviteIncludedItem {
    icon: React.ReactNode;
    text: string;
}

interface InviteHost {
    image: string;
    name: string;
    role: string;
    bio: string;
    quote: string;
    instagram?: string;
}

interface InviteConfig {
    slug: string;
    clientName?: string;
    seo: { title: string; description: string; ogImage: string };
    hero: { image: string; label: string; title: React.ReactNode; subtitle: string };
    intro: { text: string; quote: string };
    loft: {
        image: string;
        secondaryImages: [string, string];
        location: string;
        detail: string;
    };
    itinerary: InviteItineraryItem[];
    included: InviteIncludedItem[];
    host: InviteHost;
    pricing: { amount: string; perPerson: string; note: string };
    contact: { whatsapp: string; email: string };
}

// ─── Invite Configs ──────────────────────────────────────────────────────────

const inviteConfigs: Record<string, InviteConfig> = {
    winter: {
        slug: "winter",
        seo: {
            title: "Winter Escape | Swissperiences",
            description: "A private invitation for 48 hours in the Swiss Alps. Ski, fondue, silence.",
            ogImage: "/images/villars/sea-of-clouds-sunset.jpeg",
        },
        hero: {
            image: "/images/villars/drone-valley-winter.jpeg",
            label: "Private Invitation",
            title: (
                <>
                    Winter Escape<span className="text-switz-red">.</span>
                </>
            ),
            subtitle: "48 hours in the Swiss Alps. No agenda. No noise. Just mountain.",
        },
        intro: {
            text: "You don't need another trip. You need a real pause — the kind that resets everything. I've taken care of every detail so the only thing you need to do is show up. The rest is on me.",
            quote: "The world demands speed. The mountain demands stillness.",
        },
        loft: {
            image: "/images/villars-hero.jpg",
            secondaryImages: ["/images/apartment-fireplace.jpg", "/images/villars/dawn-fog-chalets.jpeg"],
            location: "Villars-sur-Ollon, 1,300m",
            detail: "Exclusively yours. Panoramic views of the Alps, fully equipped kitchen, wood fireplace and high-speed Wi-Fi. No one else has the key.",
        },
        itinerary: [
            {
                icon: <MapPin className="w-5 h-5" />,
                label: "Day 1 — Arrival",
                title: "Gate Pickup",
                description: "I pick you up at Geneva Airport or the TGV station. Private Range Rover, curated playlist, and a one-hour drive where the city fades away and the Alps take over the windshield.",
                image: "/images/alpine-road-villars.jpg",
            },
            {
                icon: <Flame className="w-5 h-5" />,
                label: "Day 1 — Evening",
                title: "The Sanctuary",
                description: "The door opens. The welcome basket is already on the table — local cheeses, wine and Swiss chocolate. Paintings of Swiss cows on the walls, a sofa that swallows you whole, and the silence of the Alps through the entire window. Tonight, you don't need to do anything else.",
                image: "/images/villars-gallery-3.jpg",
            },
            {
                icon: <Mountain className="w-5 h-5" />,
                label: "Day 2 — Morning",
                title: "Ski Experience",
                description: "Morning in the Alps with a private instructor from Villars Ski School — at your pace, no lines, no group. Meanwhile, a 4K drone captures everything from above. The footage is yours.",
                image: "/images/villars/ski-station-panorama.jpeg",
            },
            {
                icon: <Sun className="w-5 h-5" />,
                label: "Day 2 — Afternoon",
                title: "Your Time",
                description: "No agenda. You choose: stroll through the village, have a coffee on a terrace overlooking the Alps, or simply stay in the loft in silence. Time stops here.",
                image: "/images/villars/morning-peak-sun.jpeg",
            },
            {
                icon: <Flame className="w-5 h-5" />,
                label: "Day 2 — Evening",
                title: "Après-Ski & Fondue",
                description: "Bains de Villars — heated pool with a view of the Alps to unwind. Then, Gruyère AOP fondue prepared at the loft. Wine, candles, and no rush to leave.",
                image: "/images/villars/bains-winter-pool.jpeg",
            },
            {
                icon: <Car className="w-5 h-5" />,
                label: "Day 3 — Morning",
                title: "The Farewell",
                description: "Breakfast with a view. No rush to leave. When you're ready, I drive you back to Geneva — with the drone edit of your weekend already on your phone.",
                image: "/images/villars/sunset-snow-road.jpeg",
            },
        ],
        included: [
            { icon: <MapPin className="w-4 h-4" />, text: "Private transfer Geneva ↔ Villars (Range Rover)" },
            { icon: <Users className="w-4 h-4" />, text: "2 nights at The Villars Loft (fully exclusive)" },
            { icon: <Mountain className="w-4 h-4" />, text: "Private ski lesson with dedicated instructor" },
            { icon: <Flame className="w-4 h-4" />, text: "Traditional fondue at the loft + Welcome basket" },
            { icon: <Camera className="w-4 h-4" />, text: "Photos & 4K drone video of your weekend" },
            { icon: <Clock className="w-4 h-4" />, text: "Dedicated host (EN/PT/FR) throughout your stay" },
        ],
        host: {
            image: "/images/host-road-winter.jpg",
            name: "Cauêh Vidal",
            role: "Host & Founder",
            bio: "I live in Switzerland, I know every curve of these mountains and I take care of every detail personally. I'm not an agency — I'm the person who picks you up at the airport, prepares the loft before you arrive, and makes sure you don't have to think about anything for 48 hours.",
            quote: "I built this to be the kind of experience I'd want to receive.",
            instagram: "https://instagram.com/caueh",
        },
        pricing: {
            amount: "CHF 1,200",
            perPerson: "48h for 2 guests · entire loft exclusively yours · from CHF 700/person for groups of 4",
            note: "Only 2 spots available in March.",
        },
        contact: {
            whatsapp: "https://wa.me/41787002202?text=" + encodeURIComponent("Hi Cauêh, I received the invitation for the Winter Escape in Villars. I'd like to know the availability for upcoming dates."),
            email: "hello@swissperiences.ch",
        },
    },
};

// ─── Invalid Invite ──────────────────────────────────────────────────────────

function InvalidInvite() {
    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title="Invitation | Swissperiences"
                description="Private invitation to a curated Swiss experience."
                noIndex
            />
            <Navigation />
            <main className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
                <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase mb-6">
                    Private Invitation
                </span>
                <h1 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
                    This invitation is no<br />longer available.
                </h1>
                <p className="text-white/40 font-light text-base max-w-sm mb-12 leading-relaxed">
                    The link you followed may have expired or is not valid.
                </p>
                <div className="flex flex-col sm:flex-row gap-5 items-center">
                    <a
                        href="https://wa.me/41787002202"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white text-black px-10 py-4 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                    >
                        Contact Us
                    </a>
                    <Link
                        to="/"
                        className="text-white/30 text-xs uppercase tracking-[0.15em] hover:text-white/60 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}

// ─── Main Invite Page ────────────────────────────────────────────────────────

export default function InvitePage() {
    const { code } = useParams<{ code: string }>();
    const config = code ? inviteConfigs[code.toLowerCase()] : undefined;

    if (!config) {
        return <InvalidInvite />;
    }

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title={config.seo.title}
                description={config.seo.description}
                ogImage={config.seo.ogImage}
                keywords="swissperiences, private invitation, luxury swiss experience, villars, alps"
                noIndex
            />
            <Navigation />

            <main>
                {/* ── Hero ─────────────────────────────────────────────── */}
                <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={config.hero.image}
                            alt="Swiss Alps"
                            className="w-full h-full object-cover brightness-[0.4] saturate-[0.8]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-neutral-950" />
                    </div>
                    <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-20">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase mb-6"
                        >
                            {config.hero.label}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 italic tracking-tight"
                        >
                            {config.hero.title}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-lg mx-auto text-white/50 font-light text-base md:text-lg leading-relaxed"
                        >
                            {config.hero.subtitle}
                        </motion.p>
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-white/20 text-[9px] uppercase tracking-[0.3em] mt-8 block"
                        >
                            Private invitation · 1–4 guests · Villars-sur-Ollon, Switzerland
                        </motion.span>
                    </div>
                </section>

                {/* ── Intro + Quote ────────────────────────────────────── */}
                <section className="max-w-3xl mx-auto px-6 py-20 md:py-28">
                    <ScrollReveal>
                        <p className="text-white/60 font-light text-lg md:text-xl leading-relaxed mb-12">
                            {config.intro.text}
                        </p>
                    </ScrollReveal>
                    <ScrollReveal delay={0.1}>
                        <blockquote className="border-l-2 border-switz-red/50 pl-6 md:pl-8">
                            <p className="text-white/80 font-serif italic text-xl md:text-2xl leading-relaxed">
                                "{config.intro.quote}"
                            </p>
                        </blockquote>
                    </ScrollReveal>
                </section>

                {/* ── The Loft ─────────────────────────────────────────── */}
                <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
                    <ScrollReveal>
                        <div className="mb-10">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                The Sanctuary
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                Your alpine refuge<span className="text-switz-red">.</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal>
                        <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-sm group mb-3">
                            <img
                                src={config.loft.image}
                                alt="The Villars Loft"
                                className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105 brightness-[0.9] group-hover:brightness-100"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                                <span className="text-[9px] text-white/50 uppercase tracking-[0.2em] block mb-1">Location</span>
                                <span className="text-white font-serif text-base md:text-lg">{config.loft.location}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-sm group">
                                <img
                                    src={config.loft.secondaryImages[0]}
                                    alt="Loft detail"
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 brightness-[0.85]"
                                    loading="lazy"
                                />
                            </div>
                            <div className="relative aspect-[16/9] overflow-hidden rounded-sm group">
                                <img
                                    src={config.loft.secondaryImages[1]}
                                    alt="Alpine dawn with fog"
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 brightness-[0.85]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.15}>
                        <p className="text-white/40 font-light text-sm max-w-xl mb-4">
                            {config.loft.detail}
                        </p>
                        <Link
                            to="/sanctuaries/villars"
                            className="inline-flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.15em] hover:text-switz-red transition-colors"
                        >
                            See full details <ChevronRight className="w-3 h-3" />
                        </Link>
                    </ScrollReveal>
                </section>

                {/* ── Itinerary ────────────────────────────────────────── */}
                <section className="bg-white/[0.02] border-y border-white/5 py-20 md:py-28">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="mb-14">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                    The Itinerary
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                    48 hours, frame by frame<span className="text-switz-red">.</span>
                                </h2>
                            </div>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            {config.itinerary.map((item, index) => (
                                <ScrollReveal key={index} delay={index * 0.1}>
                                    <div className="group border border-white/5 hover:border-white/15 rounded-sm overflow-hidden transition-all duration-500">
                                        {item.image && (
                                            <div className="aspect-[16/9] overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-[0.7] group-hover:brightness-[0.85] group-hover:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        )}
                                        <div className="p-6 md:p-8">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="text-switz-red/70">{item.icon}</div>
                                                <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                                            <p className="text-white/40 font-light text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── What's Included ──────────────────────────────────── */}
                <section className="max-w-4xl mx-auto px-6 py-20 md:py-28">
                    <ScrollReveal>
                        <div className="mb-12">
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                All Included
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                Zero worries<span className="text-switz-red">.</span>
                            </h2>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                        {config.included.map((item, index) => (
                            <ScrollReveal key={index} delay={index * 0.05}>
                                <div className="flex items-start gap-4 py-4 border-b border-white/5 group">
                                    <div className="text-switz-red/60 mt-0.5 group-hover:text-switz-red transition-colors">
                                        {item.icon}
                                    </div>
                                    <span className="text-white/60 font-light text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                                        {item.text}
                                    </span>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.3}>
                        <p className="text-white/25 font-light text-xs italic mt-10 max-w-md">
                            You don't touch your luggage, you don't see a ticket. Just arrive. The rest happens in silence.
                        </p>
                    </ScrollReveal>
                </section>

                {/* ── Enhancements ────────────────────────────────────── */}
                <section className="max-w-3xl mx-auto px-6 pb-20 md:pb-28">
                    <ScrollReveal>
                        <div className="border border-white/5 rounded-sm p-8 md:p-12">
                            <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] block mb-6">
                                For those who want more
                            </span>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-white/40 font-light text-sm">Helicopter transfer from Geneva</span>
                                    <span className="text-white/20 text-[10px] uppercase tracking-[0.15em]">on request</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-white/5">
                                    <span className="text-white/40 font-light text-sm">Private chef experience at the loft</span>
                                    <span className="text-white/20 text-[10px] uppercase tracking-[0.15em]">on request</span>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-white/40 font-light text-sm">Sommelier-curated wine pairing</span>
                                    <span className="text-white/20 text-[10px] uppercase tracking-[0.15em]">on request</span>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </section>

                {/* ── Your Host ───────────────────────────────────────── */}
                <section className="border-t border-white/5 py-20 md:py-28">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
                            <ScrollReveal variant="scale" className="w-full md:w-5/12">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-sm group">
                                    <img
                                        src={config.host.image}
                                        alt={config.host.name}
                                        className="w-full h-full object-cover object-[center_25%] grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-[0.85] group-hover:brightness-100"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <span className="text-[9px] text-white/40 uppercase tracking-[0.2em] block mb-1">Your Host</span>
                                        <span className="text-white font-serif text-lg">{config.host.name}</span>
                                    </div>
                                </div>
                            </ScrollReveal>

                            <div className="w-full md:w-7/12 space-y-8">
                                <ScrollReveal delay={0.1}>
                                    <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                        Who welcomes you
                                    </span>
                                    <h2 className="text-3xl md:text-4xl font-serif leading-tight mb-2">
                                        {config.host.name}<span className="text-switz-red">.</span>
                                    </h2>
                                    <p className="text-white/40 text-xs uppercase tracking-[0.15em]">
                                        {config.host.role}
                                    </p>
                                </ScrollReveal>

                                <ScrollReveal delay={0.2}>
                                    <p className="text-white/60 font-light text-base md:text-lg leading-relaxed max-w-[50ch]">
                                        {config.host.bio}
                                    </p>
                                </ScrollReveal>

                                <ScrollReveal delay={0.3}>
                                    <blockquote className="border-l-2 border-switz-red/50 pl-6">
                                        <p className="text-white/80 font-serif italic text-lg md:text-xl leading-relaxed">
                                            "{config.host.quote}"
                                        </p>
                                    </blockquote>
                                </ScrollReveal>

                                {config.host.instagram && (
                                    <ScrollReveal delay={0.4}>
                                        <a
                                            href={config.host.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-white/30 text-xs uppercase tracking-[0.15em] hover:text-white/60 transition-colors"
                                        >
                                            @caueh →
                                        </a>
                                    </ScrollReveal>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Journals Teaser ─────────────────────────────────── */}
                <section className="max-w-3xl mx-auto px-6 pb-20 md:pb-28">
                    <ScrollReveal>
                        <Link to="/journals" className="group block border border-white/5 hover:border-white/15 rounded-sm p-8 md:p-12 transition-all duration-500">
                            <div className="flex items-start gap-6">
                                <div className="text-switz-red/40 group-hover:text-switz-red/70 transition-colors mt-1">
                                    <BookOpen className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] block mb-3">
                                        The Journals
                                    </span>
                                    <h3 className="text-xl md:text-2xl font-serif text-white/80 group-hover:text-white transition-colors mb-3">
                                        Stories from the Alps<span className="text-switz-red">.</span>
                                    </h3>
                                    <p className="text-white/30 font-light text-sm leading-relaxed max-w-lg">
                                        Real life in the Swiss Alps — the hidden trails, the quiet mornings, and what it's really like to call this place home.
                                    </p>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white/40 group-hover:translate-x-1 transition-all mt-2" />
                            </div>
                        </Link>
                    </ScrollReveal>
                </section>

                {/* ── Pricing + CTA ────────────────────────────────────── */}
                <section className="border-t border-white/5 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <ScrollReveal>
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                Investment
                            </span>
                            <div className="text-6xl md:text-8xl font-serif text-white italic tracking-tight mb-4">
                                {config.pricing.amount}
                            </div>
                            <p className="text-white/30 text-sm font-light mb-2">
                                {config.pricing.perPerson}
                            </p>
                            <p className="text-switz-red/70 text-xs uppercase tracking-[0.15em] font-bold mb-14">
                                {config.pricing.note}
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.1}>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                <a
                                    href={config.contact.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group bg-white text-black px-12 py-5 uppercase tracking-[0.25em] text-[10px] font-bold hover:bg-switz-red hover:text-white transition-all duration-500 flex items-center gap-3"
                                >
                                    Message on WhatsApp
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href={`mailto:${config.contact.email}`}
                                    className="text-white/30 text-xs uppercase tracking-[0.15em] font-bold hover:text-white/60 transition-colors"
                                >
                                    Or send an email →
                                </a>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <p className="text-white/15 text-[10px] uppercase tracking-[0.2em] mt-14">
                                This is a private invitation. Please do not share this link.
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
