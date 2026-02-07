import { useState } from "react";
import { ArrowRight, Check, Calendar, Lock, Users, Camera, Mountain, Train, Plus, ShieldCheck, MapPin, Instagram, Home } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import SEO from "@/components/SEO";
import { cn } from "@/lib/utils";

export interface ProposalTier {
    count: number;
    price: number;
    total: number;
    label: string;
}

export interface ProposalAddOn {
    id: string;
    label: string;
    description: string;
    price: number;
}

export interface ProposalConfig {
    meta: {
        reference: string;
        clientName: string;
        dates: string;
        heroTitle: React.ReactNode;
        heroSubtitle: React.ReactNode;
        introText: string;
        philosophyText: React.ReactNode;
        seo?: {
            title: string;
            description: string;
            ogImage?: string;
        };
    };
    images: {
        hero: string;
        residence: {
            main: string;
            secondary1: string;
            secondary2: string;
        };
        host: string;
    };
    itinerary: {
        day1: {
            title: React.ReactNode;
            items: {
                title: string;
                description: string;
                image?: string;
                icon?: "map" | "camera" | "lock";
            }[];
        };
        day2: {
            title: React.ReactNode;
            items: {
                title: string;
                description: string;
                image?: string;
                icon?: "mountain" | "train";
            }[];
        };
    };
    contact: {
        whatsapp: string;
    };
    pricing: {
        tiers: ProposalTier[];
        addOns: ProposalAddOn[];
    };
}

export default function ProposalTemplate({ config }: { config: ProposalConfig }) {
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    // Default to first tier total if available, else 0
    const [selectedTier, setSelectedTier] = useState<number>(config.pricing.tiers[0]?.total || 0);

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const addonsTotal = selectedAddons.reduce((sum, id) => {
        const addon = config.pricing.addOns.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
    }, 0);

    const finalPrice = selectedTier + addonsTotal;

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-switz-red/30 selection:text-switz-red pb-40 relative overflow-x-hidden">
            {/* Cinematic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-white/5 rounded-full blur-[120px] opacity-20" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-switz-red/5 rounded-full blur-[150px] opacity-20" />
            </div>

            <SEO
                title={config.meta.seo?.title || `Swissperiences Proposal | ${config.meta.clientName}`}
                description={config.meta.seo?.description || `Private proposal for ${config.meta.clientName}`}
                ogImage={config.meta.seo?.ogImage || config.images.hero}
                keywords="swissperiences, private proposal, luxury travel, switzerland"
            />

            <div className="relative z-10">
                <Navigation onWaitlistClick={() => window.location.href = `/secure-deposit?intent=${config.meta.clientName}_Proposal&tier=Total_£${finalPrice}`} />

                <main className="pt-24 pb-16 px-5 md:px-12 max-w-5xl mx-auto">

                    {/* Header Section */}
                    <section className="mb-32 pt-12 relative">
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-switz-red text-[9px] font-bold tracking-[0.4em] uppercase animate-fade-in border border-switz-red/20 px-3 py-1 rounded-full bg-switz-red/5">
                                {config.meta.reference}
                            </span>
                            <div className="h-px w-12 bg-gradient-to-r from-switz-red/50 to-transparent" />
                        </div>
                        <h1 className="text-6xl md:text-9xl font-serif text-white mb-10 leading-[0.95] animate-fade-in delay-100 italic tracking-tighter opacity-90">
                            {config.meta.heroTitle} <br /> <span className="text-4xl md:text-7xl opacity-50 not-italic font-sans tracking-tight">{config.meta.heroSubtitle}</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-white/50 font-light max-w-2xl leading-relaxed animate-fade-in delay-200 ml-1">
                            {config.meta.introText}
                        </p>
                        <div className="mt-16 p-10 bg-white/[0.02] border-l border-white/10 max-w-3xl backdrop-blur-sm relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-[2px] h-full bg-switz-red opacity-50 group-hover:opacity-100 transition-opacity" />
                            <p className="text-lg text-white/70 font-light italic leading-relaxed">
                                {config.meta.philosophyText}
                            </p>
                        </div>
                    </section>

                    {/* Hero Visualization */}
                    <section className="mb-32">
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm mb-4 group shadow-2xl">
                            <img src={config.images.hero} alt="Hero" className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110 brightness-[0.8] group-hover:brightness-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                <div>
                                    <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block animate-pulse">Peak State</span>
                                    <h3 className="text-3xl md:text-4xl font-serif text-white italic">Glacier 3000.</h3>
                                </div>
                                <span className="text-[9px] uppercase tracking-widest text-white/30 hidden md:block">Real Swiss Peaks</span>
                            </div>
                        </div>
                    </section>

                    {/* The Residence */}
                    <section className="mb-32">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center group">
                            <span>The Residence (The Villars Loft)</span>
                            <a href="/sanctuaries/villars" target="_blank" className="text-[10px] uppercase tracking-widest text-switz-red hover:text-white transition-colors flex items-center gap-2">
                                Explore Full Residence <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </a>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[650px]">
                            <div className="md:col-span-8 relative overflow-hidden rounded-sm group h-[400px] md:h-full">
                                <img src={config.images.residence.main} alt="Living Room" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 brightness-[0.9] group-hover:brightness-100" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                                <div className="absolute bottom-12 left-12">
                                    <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">Atmosphere</span>
                                    <h4 className="text-4xl font-serif text-white italic">Seu QG nos Alpes.</h4>
                                </div>
                            </div>

                            <div className="md:col-span-4 flex flex-col gap-4">
                                <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[220px]">
                                    <img src={config.images.residence.secondary1} alt="Curated Art" className="w-full h-full object-cover transition-all duration-1000" />
                                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 text-[9px] uppercase tracking-widest text-white/80">
                                        Curated Space
                                    </div>
                                </div>
                                <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[220px]">
                                    <img src={config.images.residence.secondary2} alt="Fireplace" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute bottom-4 left-4">
                                        <span className="text-white/40 text-[9px] uppercase tracking-widest italic group-hover:text-switz-red transition-colors">Wood Fireplace</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                                <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">Marshall Sound</span>
                                <p className="text-[11px] text-white/50 leading-relaxed font-light">Fidelidade sonora absoluta em todos os ambientes.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                                <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">Cozinha Design</span>
                                <p className="text-[11px] text-white/50 leading-relaxed font-light">Equipada para o ritual de nutrição de montanha.</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                                <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">High Speed WiFi</span>
                                <p className="text-[11px] text-white/50 leading-relaxed font-light">Conexão estável para qualquer necessidade remota.</p>
                            </div>
                            <a href="/sanctuaries/villars" target="_blank" className="bg-switz-red/10 border border-switz-red/30 p-6 rounded-sm flex flex-col items-center justify-center group cursor-pointer transition-all hover:bg-switz-red/20">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-switz-red font-bold">Resort Residence</span>
                                <span className="text-[9px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors mt-1 flex items-center gap-2">View Full Specs <ArrowRight className="w-2 h-2" /></span>
                            </a>
                        </div>
                    </section>

                    {/* Social Proof */}
                    <section className="mb-32">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center">
                            <span>The Archives (Proven Track Record)</span>
                            <span className="text-[10px] font-normal lowercase tracking-normal">Real Swiss Experiences</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                            <div className="group cursor-pointer" onClick={() => window.open('/journals', '_blank')}>
                                <div className="relative aspect-video overflow-hidden rounded-lg mb-8 border border-white/10 shadow-2xl">
                                    <img src="/images/guests/ale_alex/3.jpg" alt="Ale & Alex Journey" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] block mb-3 group-hover:translate-x-1 transition-transform">The Alpine Protocol // Ale & Alex</span>
                                <p className="text-white/60 text-base font-light leading-relaxed italic border-l border-switz-red/30 pl-4">
                                    "Precision meets the peak state. Um mergulho no silêncio dos Alpes de Villars com capturas cinematográficas de drone."
                                </p>
                            </div>
                            <div className="group cursor-pointer" onClick={() => window.open('/journals', '_blank')}>
                                <div className="relative aspect-video overflow-hidden rounded-sm mb-8 border border-white/10 shadow-2xl">
                                    <img src="/images/guests/wagner/2.jpeg" alt="Wagner Journey" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700" />
                                </div>
                                <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] block mb-3 group-hover:translate-x-1 transition-transform">The Winter Ascent // Wagner & Family</span>
                                <p className="text-white/60 text-base font-light leading-relaxed italic border-l border-switz-red/30 pl-4">
                                    "Uma experiência condensada de 48h pelo Grand Tour. Do urban luxury às montanhas de Grindelwald e ao Glacier 3000."
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Itinerary Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t border-white/10 pt-24 mb-32">

                        {/* Interactive Controls */}
                        <div className="md:col-span-4 space-y-16">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-switz-red" />
                                    Janela de Execução
                                </h3>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-switz-red/20 transition-all">
                                    <p className="text-2xl text-white font-serif italic tracking-tight">{config.meta.dates}</p>
                                    <span className="text-[10px] text-white/40 uppercase tracking-widest mt-2 block">A reserva bloqueia imediatamente o Loft</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12">Configuração do Grupo</h3>
                                <div className="space-y-3">
                                    {config.pricing.tiers.map((tier) => (
                                        <div
                                            key={tier.count}
                                            onClick={() => setSelectedTier(tier.total)}
                                            className={cn(
                                                "flex justify-between items-center p-6 rounded-sm border transition-all duration-500 cursor-pointer relative overflow-hidden group",
                                                selectedTier === tier.total
                                                    ? "bg-switz-red/10 border-switz-red/50 shadow-[0_0_30px_rgba(255,46,46,0.1)]"
                                                    : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.05]"
                                            )}
                                        >
                                            <div className="relative z-10 flex items-center gap-5">
                                                <div className={cn("p-2 rounded-full transition-colors", selectedTier === tier.total ? "bg-switz-red text-white" : "bg-white/5 text-white/30")}>
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className={cn("text-[10px] font-bold tracking-[0.2em] uppercase block mb-1", selectedTier === tier.total ? "text-switz-red" : "text-white/40")}>
                                                        {tier.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <span className="block text-white font-serif text-xl tracking-tighter italic">£{tier.price} <small className="text-[9px] text-white/30 lowercase tracking-widest font-sans not-italic">/pp</small></span>
                                            </div>
                                            {selectedTier === tier.total && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-switz-red/10 via-transparent to-transparent opacity-50" />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-sm space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Home className="w-3 h-3 text-switz-red" />
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Logística da Residência</span>
                                    </div>
                                    <p className="text-[10px] text-white/33 leading-relaxed font-light italic">
                                        O Villars Loft possui 2 quartos (2 camas double). No formato <span className="text-white/50">VIP Solo</span>, o host ocupa o segundo quarto para suporte completo. <br /><br />
                                        No formato <span className="text-white/50">2+ pessoas</span>, a residência fica inteiramente para o seu grupo e o host se acomoda em locação externa.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/5 p-8 rounded-sm border border-white/10">
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-switz-red mb-8 flex items-center gap-3">
                                    <Plus className="w-4 h-4" /> Custom Enhancements
                                </h3>
                                <div className="space-y-6">
                                    {config.pricing.addOns.map((addon) => (
                                        <div
                                            key={addon.id}
                                            onClick={() => toggleAddon(addon.id)}
                                            className={cn(
                                                "cursor-pointer p-6 rounded-sm border transition-all duration-500 relative overflow-hidden group",
                                                selectedAddons.includes(addon.id)
                                                    ? "bg-switz-red/5 border-switz-red/40"
                                                    : "bg-white/[0.02] border-white/5 hover:border-switz-red/20"
                                            )}
                                        >
                                            <div className="flex justify-between items-baseline mb-3 relative z-10">
                                                <span className={cn(
                                                    "text-[10px] font-bold tracking-[0.2em] uppercase transition-colors",
                                                    selectedAddons.includes(addon.id) ? "text-switz-red" : "text-white/50 group-hover:text-white"
                                                )}>{addon.label}</span>
                                                <span className="text-base font-serif italic text-white tracking-tight ml-4">+ £{addon.price}</span>
                                            </div>
                                            <p className="text-[11px] text-white/30 font-light leading-relaxed relative z-10">{addon.description}</p>
                                            <div className={cn(
                                                "absolute top-1/2 -translate-y-1/2 right-4 w-1.5 h-1.5 rounded-full transition-all duration-500",
                                                selectedAddons.includes(addon.id) ? "bg-switz-red shadow-[0_0_10px_#FF2E2E]" : "bg-white/5"
                                            )} />
                                        </div>
                                    ))}
                                    <div className="mt-8 pt-8 border-t border-white/10 italic">
                                        <p className="text-[10px] text-white/30 leading-relaxed font-light">
                                            *Protocolo de Ski e Instrutor Dedicado já inclusos na base.<br />
                                            *Capturas de Drone sujeitas a segurança meteorológica.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary */}
                        <div className="md:col-span-8 space-y-24">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 p-10 bg-white/5 border border-white/10 rounded-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                                    <ShieldCheck className="w-24 h-24 text-switz-red" />
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Transfer</span>
                                    <p className="text-sm text-white/80 font-serif italic">Range Rover Private</p>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Safe Zone</span>
                                    <p className="text-sm text-white/80 font-serif italic">Portuguese Host</p>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Artifacts</span>
                                    <p className="text-sm text-white/80 font-serif italic">High-End Photo/Video</p>
                                </div>
                                <div className="space-y-2 relative z-10">
                                    <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">The Loft</span>
                                    <p className="text-sm text-white/80 font-serif italic">Solo/Group Use</p>
                                </div>
                            </div>

                            {/* Day 1 */}
                            <div className="relative pl-0 md:pl-16 border-l-0 md:border-l border-white/5 group">
                                <span className="hidden md:block absolute -left-[6px] top-0 w-[12px] h-[12px] rounded-full bg-switz-red shadow-[0_0_20px_rgba(255,46,46,0.5)] transition-all duration-700 group-hover:scale-150" />
                                <span className="text-[10px] uppercase tracking-[0.4em] text-switz-red md:text-white/20 mb-6 block font-bold group-hover:text-switz-red transition-colors">Day 01 // The Reset</span>
                                <h3 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white mb-12 md:mb-20 italic tracking-tighter leading-[1.1] md:leading-[0.9]">
                                    {config.itinerary.day1.title}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
                                    <div className="md:col-span-5 space-y-16 md:space-y-24">
                                        {config.itinerary.day1.items.slice(0, 2).map((item, idx) => (
                                            <div key={idx} className="relative group/item pl-4 md:pl-0 border-l border-white/10 md:border-none">
                                                <div className="md:absolute md:left-[-81px] md:top-0 mb-4 md:mb-0 inline-block p-2 bg-neutral-950 border border-white/10 rounded-full group-hover/item:border-switz-red/50 transition-colors">
                                                    {item.icon === 'map' && <MapPin className="w-4 h-4 text-white/50 group-hover/item:text-switz-red transition-colors" />}
                                                    {item.icon === 'camera' && <Camera className="w-4 h-4 text-white/50 group-hover/item:text-switz-red transition-colors" />}
                                                </div>
                                                <h4 className="text-lg font-serif italic text-white mb-4">{item.title}</h4>
                                                <p className="text-sm text-white/40 leading-relaxed font-light font-sans max-w-xs mb-4">
                                                    {item.description}
                                                </p>
                                                {item.image && (
                                                    <div className="aspect-[16/9] overflow-hidden rounded-sm opacity-60 hover:opacity-100 transition-all duration-1000">
                                                        <img src={item.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="md:col-span-7">
                                        {config.itinerary.day1.items[2] && (
                                            <div className="relative h-full flex flex-col group/item">
                                                <div className="md:absolute md:left-[-81px] md:hidden top-0 mb-4 inline-block p-2 bg-neutral-950 border border-white/10 rounded-full">
                                                    <Lock className="w-4 h-4 text-white/50" />
                                                </div>
                                                <div className="aspect-[3/4] overflow-hidden rounded-sm mb-8 relative">
                                                    <img src={config.itinerary.day1.items[2].image} className="w-full h-full object-cover grayscale opacity-40 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-[1500ms]" />
                                                    <div className="absolute bottom-6 left-6 right-6">
                                                        <span className="text-switz-red text-[9px] font-bold tracking-[0.3em] uppercase block mb-2">Arrival</span>
                                                        <h4 className="text-3xl font-serif italic text-white leading-none">{config.itinerary.day1.items[2].title}</h4>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-white/40 leading-relaxed font-light font-sans max-w-md">
                                                    {config.itinerary.day1.items[2].description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Day 2 */}
                            <div className="relative pl-16 border-l border-white/10 group">
                                <span className="absolute -left-[6px] top-0 w-[12px] h-[12px] rounded-full bg-white/10 border border-white/20 group-hover:bg-switz-red transition-all duration-700 group-hover:shadow-[0_0_20px_rgba(255,46,46,0.5)]" />
                                <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 mb-6 block font-bold">Day 02 // The Peak State</span>
                                <h3 className="text-5xl font-serif text-white mb-12 italic border-b border-white/5 pb-8 tracking-tighter">
                                    {config.itinerary.day2.title}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        {config.itinerary.day2.items[0] && (
                                            <div className="flex flex-col gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                                <div className="flex items-start gap-6">
                                                    <div className="mt-1"><Mountain className="w-5 h-5 text-switz-red" /></div>
                                                    <div>
                                                        <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">{config.itinerary.day2.items[0].title}</h4>
                                                        <p className="text-sm text-white/60 leading-relaxed font-light italic">{config.itinerary.day2.items[0].description}</p>
                                                    </div>
                                                </div>
                                                {config.itinerary.day2.items[0].image && (
                                                    <div className="aspect-video overflow-hidden rounded-sm border border-white/10">
                                                        <img src={config.itinerary.day2.items[0].image} className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-8">
                                        {config.itinerary.day2.items[1] && (
                                            <div className="flex items-start gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                                <div className="mt-1"><Train className="w-5 h-5 text-switz-red" /></div>
                                                <div>
                                                    <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">{config.itinerary.day2.items[1].title}</h4>
                                                    <p className="text-sm text-white/60 leading-relaxed font-light italic flex flex-col gap-4">
                                                        <span>{config.itinerary.day2.items[1].description}</span>
                                                        {config.itinerary.day2.items[1].image && (
                                                            <div className="aspect-[3/2] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                                                                <img src={config.itinerary.day2.items[1].image} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
                                                            </div>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About the Host */}
                    <section className="mb-32 grid grid-cols-1 md:grid-cols-12 gap-16 items-center border-t border-white/10 pt-32">
                        <div className="md:col-span-12 lg:col-span-5 relative group">
                            <div className="aspect-[4/5] bg-neutral-900 rounded-sm overflow-hidden border border-white/10 shadow-3xl">
                                <img
                                    src={config.images.host}
                                    alt="Caueh Vidal"
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2000ms] brightness-90 hover:brightness-100"
                                />
                            </div>
                            <div className="absolute -bottom-8 -right-8 bg-neutral-900 p-10 border border-white/10 hidden md:block text-right shadow-2xl backdrop-blur-md bg-opacity-95">
                                <span className="text-switz-red text-[11px] font-bold tracking-[0.4em] uppercase block mb-3">Host & Arquiteto</span>
                                <span className="text-white font-serif text-3xl italic tracking-tight italic">Caueh Vidal.</span>
                            </div>
                        </div>
                        <div className="md:col-span-12 lg:col-start-7 lg:col-span-6 space-y-10">
                            <div>
                                <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase block mb-6">Host Residency</span>
                                <h2 className="text-5xl md:text-7xl font-serif text-white italic leading-tight tracking-tighter">Seu vizinho <br /> de montanha.</h2>
                            </div>

                            <div className="p-8 bg-switz-red/5 border border-switz-red/20 rounded-sm">
                                <p className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-switz-red animate-pulse" /> Multilingual Support
                                </p>
                                <p className="text-white/80 font-light text-lg italic leading-relaxed">
                                    "Aqui você fala Português. Eu resolvo o Francês e o Inglês por você. Minha missão é garantir que a logística seja invisível e a execução seja impecável."
                                </p>
                            </div>

                            <p className="text-white/50 font-light leading-relaxed text-xl italic border-l border-white/10 pl-8">
                                "Não sou uma agência de viagens. Sou um arquiteto de experiências residente na Suíça. Eu cuido do backstage para que você foque apenas em respirar."
                            </p>

                            <a href="https://instagram.com/caueh" target="_blank" className="inline-flex items-center gap-4 text-white/30 hover:text-switz-red transition-all duration-500 text-xs uppercase tracking-[0.3em] font-bold group">
                                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                @caueh
                            </a>
                        </div>
                    </section>

                    {/* Investment Section */}
                    <section id="investment" className="bg-neutral-900 border border-white/5 p-6 md:p-20 mb-24 relative overflow-hidden group rounded-sm shadow-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-switz-red/10 to-transparent pointer-events-none opacity-50" />

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 relative z-10">
                            <div>
                                <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase block mb-6 md:mb-10">
                                    Requisito de Entrada
                                </span>
                                <h2 className="text-4xl md:text-6xl font-serif text-white mb-8 tracking-tighter italic">Investimento.</h2>

                                <div className="mb-12 md:mb-16">
                                    <div className="text-7xl md:text-9xl font-serif text-white tracking-tighter mb-4 italic break-all md:break-normal">£{finalPrice}</div>
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                                        {addonsTotal > 0 && <span className="text-white/20 text-2xl line-through font-serif italic">£{selectedTier}</span>}
                                        <span className="text-switz-red text-[9px] font-bold uppercase tracking-[0.3em] bg-switz-red/10 border border-switz-red/20 px-4 py-2 inline-flex items-center gap-3 w-fit">
                                            <div className="w-2 h-2 rounded-full bg-switz-red animate-pulse" /> Private Intake Confirmed
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-8 mb-16">
                                    <div className="flex items-center gap-5 text-white/70 group/item">
                                        <Check className="w-6 h-6 text-switz-red" />
                                        <span className="text-base font-light italic group-hover:text-white transition-colors tracking-tight">
                                            {selectedTier === config.pricing.tiers[0].total
                                                ? "Experiência Individual VIP"
                                                : `${selectedTier === config.pricing.tiers[1]?.total ? "2 Pessoas" : selectedTier === config.pricing.tiers[2]?.total ? "3 Pessoas" : "4 Pessoas"} em Grupo`
                                            }
                                        </span>
                                    </div>
                                    {selectedAddons.length > 0 && (
                                        <div className="flex items-center gap-5 text-white/70 group/item">
                                            <Check className="w-6 h-6 text-switz-red" />
                                            <span className="text-base font-light italic group-hover:text-white transition-colors tracking-tight">Incluindo: {selectedAddons.map(id => config.pricing.addOns.find(a => a.id === id)?.label).join(", ")}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => window.location.href = `/secure-deposit?intent=${config.meta.clientName}_Proposal&tier=Total_£${finalPrice}`}
                                    className="bg-white text-black px-12 py-6 uppercase tracking-[0.4em] text-[12px] font-bold hover:bg-switz-red hover:text-white transition-all duration-1000 flex items-center justify-center gap-6 group w-full shadow-2xl"
                                >
                                    Secure Your Intake
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-700" />
                                </button>

                                <div className="mt-10 flex flex-col items-center gap-6">
                                    <p className="text-[11px] text-white/20 uppercase tracking-[0.3em] italic text-center leading-relaxed">A emissão da invoice formal ocorre após a <br /> reserva do depósito de compromisso.</p>
                                    <a
                                        href={config.contact.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-white/40 hover:text-switz-red transition-all duration-500 uppercase tracking-[0.4em] border-b border-white/5 hover:border-switz-red pb-2 font-bold"
                                    >
                                        Falar com Caueh (WhatsApp)
                                    </a>
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col justify-center">
                                <div className="p-16 bg-white/5 border border-white/10 rounded-sm backdrop-blur-md relative overflow-hidden group/card hover:border-switz-red/30 transition-all duration-1000 shadow-3xl">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-switz-red opacity-30 group-hover:opacity-100 transition-all duration-1000" />
                                    <h3 className="text-4xl font-serif text-white mb-10 italic leading-tight tracking-tighter">A logística é nossa. <br /> O silêncio é seu.</h3>
                                    <ul className="space-y-8">
                                        <li className="flex items-center gap-6 text-white/30 text-[11px] tracking-[0.3em] uppercase font-bold group-hover:text-white/60 transition-colors">
                                            <div className="w-4 h-[2px] bg-switz-red group-hover:w-8 transition-all" /> Sem burocracia de hotel
                                        </li>
                                        <li className="flex items-center gap-6 text-white/30 text-[11px] tracking-[0.3em] uppercase font-bold group-hover:text-white/60 transition-colors">
                                            <div className="w-4 h-[2px] bg-switz-red group-hover:w-8 transition-all" /> Sem barreiras de idioma
                                        </li>
                                        <li className="flex items-center gap-6 text-white/30 text-[11px] tracking-[0.3em] uppercase font-bold group-hover:text-white/60 transition-colors">
                                            <div className="w-4 h-[2px] bg-switz-red group-hover:w-8 transition-all" /> Sem stress de transporte
                                        </li>
                                    </ul>
                                    <div className="mt-20 flex justify-between items-end border-t border-white/5 pt-10">
                                        <ShieldCheck className="w-12 h-12 text-switz-red opacity-30 animate-pulse" />
                                        <div className="flex flex-col items-end gap-3">
                                            <span className="text-[10px] text-white/10 uppercase tracking-[0.5em]">Swiss Quality</span>
                                            <img src="/images/swiss-quality.png" alt="Swiss Quality Certified" className="h-16 w-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] opacity-40 hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </main>
            </div>
            <Footer />
        </div>
    );
}
