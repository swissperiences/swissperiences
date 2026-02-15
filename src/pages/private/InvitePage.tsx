import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Mountain, Flame, Camera, Clock, Users, ChevronRight } from "lucide-react";
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
            description: "Um convite privado para 48 horas nos Alpes Suíços. Ski, fondue, silêncio.",
            ogImage: "/images/villars-winter-aerial.jpg",
        },
        hero: {
            image: "/images/villars-winter-aerial.jpg",
            label: "Private Invitation",
            title: (
                <>
                    Winter Escape<span className="text-switz-red">.</span>
                </>
            ),
            subtitle: "48 horas nos Alpes Suíços. Sem agenda. Sem ruído. Só montanha.",
        },
        intro: {
            text: "Você não precisa de mais uma viagem. Precisa de uma pausa real — dessas que resetam. Eu preparei cada detalhe pra que a única coisa que você precise fazer seja aparecer. O resto é comigo.",
            quote: "O mundo exige velocidade. A montanha exige pausa.",
        },
        loft: {
            image: "/images/villars-hero.jpg",
            secondaryImages: ["/images/loft/IMG_8759.jpg", "/images/apt-balcony-sunset.jpg"],
            location: "Villars-sur-Ollon, 1,300m",
            detail: "Exclusivo pra você. Vista frontal pros Alpes, cozinha equipada, lareira a lenha e Wi-Fi de alta velocidade. Ninguém mais tem a chave.",
        },
        itinerary: [
            {
                icon: <MapPin className="w-5 h-5" />,
                label: "Dia 1 — Chegada",
                title: "Gate Pickup",
                description: "Eu te busco no aeroporto de Genebra ou na estação TGV. Range Rover privado, playlist curada, e uma hora de estrada onde a cidade vai ficando pra trás e os Alpes vão tomando conta do vidro.",
                image: "/images/alpine-road-villars.jpg",
            },
            {
                icon: <Flame className="w-5 h-5" />,
                label: "Dia 1 — Noite",
                title: "The Sanctuary",
                description: "A porta abre. O welcome basket já espera na mesa. Quadros de vacas suíças na parede, sofá que te engole, e o silêncio dos Alpes pela janela inteira. Hoje você não precisa fazer mais nada.",
                image: "/images/villars-gallery-3.jpg",
            },
            {
                icon: <Mountain className="w-5 h-5" />,
                label: "Dia 2 — Manhã",
                title: "Ski Experience",
                description: "Manhã nos Alpes com instrutor privado da Villars Ski School — no seu ritmo, sem fila, sem grupo. Enquanto isso, um drone 4K registra tudo de cima. O vídeo é seu.",
                image: "/images/alex_ski_update.jpg",
            },
            {
                icon: <Flame className="w-5 h-5" />,
                label: "Dia 2 — Noite",
                title: "Après-Ski & Fondue",
                description: "Bains de Villars — piscina aquecida com vista pros Alpes pra soltar o corpo. Depois, fondue de Gruyère AOP preparada no loft. Vinho, velas, e nenhuma pressa de ir embora.",
                image: "/images/mountain-sunset.jpg",
            },
        ],
        included: [
            { icon: <MapPin className="w-4 h-4" />, text: "Transfer privado Genebra ↔ Villars (Range Rover)" },
            { icon: <Users className="w-4 h-4" />, text: "2 noites no Villars Loft (exclusividade total)" },
            { icon: <Mountain className="w-4 h-4" />, text: "Aula de ski privada com instrutor dedicado" },
            { icon: <Flame className="w-4 h-4" />, text: "Fondue tradicional no loft + Welcome basket" },
            { icon: <Camera className="w-4 h-4" />, text: "Fotos & vídeo drone 4K do seu weekend" },
            { icon: <Clock className="w-4 h-4" />, text: "Host dedicado (PT/EN/FR) durante toda a estadia" },
        ],
        host: {
            image: "/images/host-road-winter.jpg",
            name: "Cauêh Vidal",
            role: "Host & Founder",
            bio: "Moro na Suíça, conheço cada curva dessas montanhas e cuido de cada detalhe pessoalmente. Não sou uma agência — sou a pessoa que vai te buscar no aeroporto, preparar o loft antes de você chegar, e garantir que você não precise pensar em nada por 48 horas.",
            quote: "Eu construí isso pra ser o tipo de experiência que eu gostaria de receber.",
            instagram: "https://instagram.com/caueh",
        },
        pricing: {
            amount: "CHF 1,200",
            perPerson: "a partir de CHF 700/pessoa para grupos",
            note: "Preço de lançamento — vagas limitadas para esta temporada.",
        },
        contact: {
            whatsapp: "https://wa.me/41787002202",
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
                                Seu refúgio nos Alpes<span className="text-switz-red">.</span>
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
                                    alt="Fireplace"
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 brightness-[0.85]"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={0.15}>
                        <p className="text-white/40 font-light text-sm max-w-xl">
                            {config.loft.detail}
                        </p>
                    </ScrollReveal>
                </section>

                {/* ── Itinerary ────────────────────────────────────────── */}
                <section className="bg-white/[0.02] border-y border-white/5 py-20 md:py-28">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal>
                            <div className="mb-14">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                    O Roteiro
                                </span>
                                <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                    48 horas, frame a frame<span className="text-switz-red">.</span>
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
                                Tudo Incluído
                            </span>
                            <h2 className="text-3xl md:text-4xl font-serif leading-tight">
                                Zero preocupações<span className="text-switz-red">.</span>
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
                                        Quem te recebe
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

                {/* ── Pricing + CTA ────────────────────────────────────── */}
                <section className="border-t border-white/5 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <ScrollReveal>
                            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-3">
                                Investimento
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
                                    Falar no WhatsApp
                                    <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <a
                                    href={`mailto:${config.contact.email}`}
                                    className="text-white/30 text-xs uppercase tracking-[0.15em] font-bold hover:text-white/60 transition-colors"
                                >
                                    Ou envie um email →
                                </a>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <p className="text-white/15 text-[10px] uppercase tracking-[0.2em] mt-14">
                                Este é um convite privado. Não compartilhe este link.
                            </p>
                        </ScrollReveal>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
