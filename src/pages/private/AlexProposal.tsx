import { useState } from "react";
import { ArrowRight, Check, Calendar, Lock, Users, Camera, Mountain, Train, Plus, ShieldCheck, MapPin, Instagram, Home } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import { cn } from "@/lib/utils";

export default function AlexProposal() {
    const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
    const [selectedTier, setSelectedTier] = useState<number>(1350); // Default to Solo

    const tiers = [
        { count: 1, price: 1350, total: 1350, label: "VIP Solo (Exclusivo)" },
        { count: 2, price: 1000, total: 2000, label: "2 Pessoas" },
        { count: 3, price: 800, total: 2400, label: "3 Pessoas" },
        { count: 4, price: 700, total: 2800, label: "4 Pessoas (Best Value)" },
    ];

    const addOns = [
        { id: "glacier", label: "Glacier 3000 Peak Walk", description: "Ponte suspensa entre picos + Almoço no Botta", price: 120 },
        { id: "night", label: "Extra Night (Villars Loft)", description: "Amplie o seu tempo de descompressão", price: 250 },
    ];

    const toggleAddon = (id: string) => {
        setSelectedAddons(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const addonsTotal = selectedAddons.reduce((sum, id) => {
        const addon = addOns.find(a => a.id === id);
        return sum + (addon ? addon.price : 0);
    }, 0);

    const finalPrice = selectedTier + addonsTotal;

    const proposalDetails = {
        clientName: "Alex",
        dates: "Proposto: Fev 2026",
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-switz-red selection:text-white pb-32">
            <Navigation onWaitlistClick={() => window.location.href = `/secure-deposit?intent=Alex_Proposal&tier=Private_Intake_Total_£${finalPrice}`} />

            <main className="pt-24 pb-16 px-5 md:px-12 max-w-5xl mx-auto">

                {/* Header Section */}
                <section className="mb-24 relative">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase animate-fade-in">
                            Proposta Privada // Ref: #001-A
                        </span>
                        <div className="h-px w-8 bg-switz-red/30" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-serif text-white mb-8 leading-[1.1] animate-fade-in delay-100 italic tracking-tight">
                        The Silent Alps <br /> <span>para {proposalDetails.clientName}.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl leading-relaxed animate-fade-in delay-200">
                        "Alex, desenhei este protocolo para desligar o ruído de Londres. O foco é um reset mental profundo, conteúdo cinematográfico e a realização do sonho do ski. Você volta não apenas descansado, mas <span className="text-white italic">revigorado</span> e focado no essencial."
                    </p>
                    <div className="mt-12 p-8 bg-switz-red/5 border-l-2 border-switz-red max-w-2xl backdrop-blur-sm">
                        <p className="text-base text-switz-red/80 font-medium italic leading-relaxed">
                            "Viver em Londres é o palco das grandes ambições, mas os Alpes são onde a gente recupera o fôlego. O que desenhei aqui é um intervalo estratégico. Um santuário para silenciar o ruído, dormir sono profundo e voltar para o jogo com a clareza que só as montanhas trazem."
                        </p>
                    </div>
                </section>

                {/* Hero Visualization - Glacier 3000 */}
                <section className="mb-32">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm mb-4 group shadow-2xl">
                        <img src="/images/glacier3000.avif" alt="Glacier 3000" className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110 brightness-[0.8] group-hover:brightness-100" />
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

                {/* The Residence: The Loft Visuals */}
                <section className="mb-32">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center group">
                        <span>The Residence (The Villars Loft)</span>
                        <a href="/villars-retreat" target="_blank" className="text-[10px] uppercase tracking-widest text-switz-red hover:text-white transition-colors flex items-center gap-2">
                            Explore Full Residence <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[650px]">
                        <div className="md:col-span-8 relative overflow-hidden rounded-sm group h-[400px] md:h-full">
                            <img src="/images/villars-hero.jpg" alt="Living Room" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110 brightness-[0.9] group-hover:brightness-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-12 left-12">
                                <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-3">Atmosphere</span>
                                <h4 className="text-4xl font-serif text-white italic">Seu QG nos Alpes.</h4>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-4">
                            <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[220px]">
                                <img src="/images/loft/IMG_8736.jpg" alt="Curated Art" className="w-full h-full object-cover transition-all duration-1000" />
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 text-[9px] uppercase tracking-widest text-white/80">
                                    Curated Space
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[220px]">
                                <img src="/images/apartment-fireplace.jpg" alt="Fireplace" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest italic group-hover:text-switz-red transition-colors">Wood Fireplace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">Starlink WiFi</span>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light">Performance total para qualquer necessidade remota.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">Sonos System</span>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light">Fidelidade sonora absoluta em todos os ambientes.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-sm hover:border-switz-red/30 transition-colors">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-2">Cozinha Design</span>
                            <p className="text-[11px] text-white/50 leading-relaxed font-light">Equipada para o ritual de nutrição de montanha.</p>
                        </div>
                        <a href="/villars-retreat" target="_blank" className="bg-switz-red/10 border border-switz-red/30 p-6 rounded-sm flex flex-col items-center justify-center group cursor-pointer transition-all hover:bg-switz-red/20">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-switz-red font-bold">Resort Residence</span>
                            <span className="text-[9px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors mt-1 flex items-center gap-2">View Full Specs <ArrowRight className="w-2 h-2" /></span>
                        </a>
                    </div>
                </section>

                {/* Social Proof: The Archives */}
                <section className="mb-32">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center">
                        <span>The Archives (Proven Track Record)</span>
                        <span className="text-[10px] font-normal lowercase tracking-normal">Real Swiss Experiences</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                        {/* Entry 1: Ale & Alex */}
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

                        {/* Entry 2: Wager family */}
                        <div className="group cursor-pointer" onClick={() => window.open('/journals', '_blank')}>
                            <div className="relative aspect-video overflow-hidden rounded-sm mb-8 border border-white/10 shadow-2xl">
                                <img src="/images/guests/wager/uploaded_image_1_1769163527795.jpg" alt="Wager Journey" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-700" />
                            </div>
                            <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] block mb-3 group-hover:translate-x-1 transition-transform">The Winter Ascent // Wager & Family</span>
                            <p className="text-white/60 text-base font-light leading-relaxed italic border-l border-switz-red/30 pl-4">
                                "Uma experiência condensada de 48h pelo Grand Tour. Do urban luxury às montanhas de Grindelwald e ao Glacier 3000."
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Itinerary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 border-t border-white/10 pt-24 mb-32">

                    {/* Left: Interactive Controls */}
                    <div className="md:col-span-4 space-y-16">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-8 flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-switz-red" />
                                Janela de Execução
                            </h3>
                            <div className="p-6 bg-white/5 border border-white/10 rounded-sm hover:border-switz-red/20 transition-all">
                                <p className="text-2xl text-white font-serif italic tracking-tight">{proposalDetails.dates}</p>
                                <span className="text-[10px] text-white/40 uppercase tracking-widest mt-2 block">A reserva bloqueia imediatamente o Loft</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12">Configuração do Grupo</h3>
                            <div className="space-y-3">
                                {tiers.map((tier) => (
                                    <div
                                        key={tier.count}
                                        onClick={() => setSelectedTier(tier.total)}
                                        className={cn(
                                            "flex justify-between items-center p-5 rounded-sm border transition-all duration-500 cursor-pointer",
                                            selectedTier === tier.total
                                                ? "bg-switz-red/10 border-switz-red shadow-[0_0_20px_rgba(255,46,46,0.1)]"
                                                : "bg-white/5 border-transparent hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-4">
                                            <Users className={cn("w-5 h-5", selectedTier === tier.total ? "text-switz-red" : "text-white/20")} />
                                            <div>
                                                <span className={cn("text-xs font-bold tracking-[0.1em] uppercase", selectedTier === tier.total ? "text-white" : "text-white/40")}>
                                                    {tier.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-white font-serif text-lg tracking-tighter italic">£{tier.price} <small className="text-[10px] text-white/30 lowercase tracking-normal">/pp</small></span>
                                        </div>
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
                                {addOns.map((addon) => (
                                    <div
                                        key={addon.id}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={cn(
                                            "cursor-pointer p-6 rounded-sm border transition-all duration-500",
                                            selectedAddons.includes(addon.id)
                                                ? "bg-switz-red/10 border-switz-red shadow-[0_0_20px_rgba(255,46,46,0.1)]"
                                                : "bg-black/20 border-white/5 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={cn(
                                                "text-xs font-bold tracking-[0.15em] uppercase",
                                                selectedAddons.includes(addon.id) ? "text-switz-red" : "text-white/60"
                                            )}>{addon.label}</span>
                                        </div>
                                        <p className="text-[11px] text-white/40 mb-4 font-light leading-relaxed">{addon.description}</p>
                                        <span className="text-sm font-serif italic tracking-tight">+ £{addon.price}</span>
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

                    {/* Right: The Process (Itinerary) */}
                    <div className="md:col-span-8 space-y-24">
                        {/* Summary of Inclusions */}
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
                        <div className="relative pl-16 border-l border-white/10 group">
                            <span className="absolute -left-[6px] top-0 w-[12px] h-[12px] rounded-full bg-switz-red shadow-[0_0_20px_rgba(255,46,46,0.5)] transition-all duration-700 group-hover:scale-150" />
                            <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 mb-6 block font-bold">Day 01 // The Reset</span>
                            <h3 className="text-5xl font-serif text-white mb-12 italic border-b border-white/5 pb-8 tracking-tighter">O Ritual de Descompressão.</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                        <div className="mt-1"><MapPin className="w-5 h-5 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">Gate Pickup</h4>
                                            <p className="text-sm text-white/40 leading-relaxed font-light italic">Busca direta no portão do TGV ou aeroporto. Desse momento em diante, o barulho do mundo diminui. O idioma oficial da viagem é o seu.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                        <div className="mt-1"><Camera className="w-5 h-5 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">Léman Session</h4>
                                            <p className="text-sm text-white/40 leading-relaxed font-light italic flex flex-col gap-4">
                                                <span>Pausa estratégica em Montreux. O ar gelado e a água cristalina começam o processo de limpeza antes de subirmos ao santuário.</span>
                                                <div className="aspect-video overflow-hidden rounded-sm border border-white/10">
                                                    <img src="/images/montreux_mood.png" className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
                                                </div>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500 h-full">
                                        <div className="flex items-start gap-6">
                                            <div className="mt-1"><Lock className="w-5 h-5 text-switz-red" /></div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">The Sanctuary</h4>
                                                <p className="text-sm text-white/40 leading-relaxed font-light italic">Check-in no Loft. Fogo na lareira, spa termal privado e o primeiro sono profundo que você experimenta em meses.</p>
                                            </div>
                                        </div>
                                        <div className="mt-auto aspect-[4/5] overflow-hidden rounded-sm border border-white/10">
                                            <img src="/images/apartment-fireplace.jpg" className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Day 2 */}
                        <div className="relative pl-16 border-l border-white/10 group">
                            <span className="absolute -left-[6px] top-0 w-[12px] h-[12px] rounded-full bg-white/10 border border-white/20 group-hover:bg-switz-red transition-all duration-700 group-hover:shadow-[0_0_20px_rgba(255,46,46,0.5)]" />
                            <span className="text-[11px] uppercase tracking-[0.4em] text-white/20 mb-6 block font-bold">Day 02 // The Peak State</span>
                            <h3 className="text-5xl font-serif text-white mb-12 italic border-b border-white/5 pb-8 tracking-tighter">O Silêncio Absoluto.</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="flex flex-col gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                        <div className="flex items-start gap-6">
                                            <div className="mt-1"><Mountain className="w-5 h-5 text-switz-red" /></div>
                                            <div>
                                                <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">Ski Mastery</h4>
                                                <p className="text-sm text-white/60 leading-relaxed font-light italic">Evolução rápida na neve. Enquanto você domina a montanha, capturamos suas melhores curvas com drone 4K para o seu arquivo pessoal.</p>
                                            </div>
                                        </div>
                                        <div className="aspect-video overflow-hidden rounded-sm border border-white/10">
                                            <img src="/images/ski_gear.png" className="w-full h-full object-cover grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-1000" />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 p-6 bg-white/5 border border-white/5 rounded-sm hover:border-switz-red/20 transition-all duration-500">
                                        <div className="mt-1"><Train className="w-5 h-5 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-white/80 mb-3">Essential Return</h4>
                                            <p className="text-sm text-white/60 leading-relaxed font-light italic flex flex-col gap-4">
                                                <span>Almoço secreto nos Alpes. Você volta para Londres não apenas descansado, mas revigorado e focado no que importa.</span>
                                                <div className="aspect-[3/2] overflow-hidden rounded-sm border border-white/10 shadow-2xl">
                                                    <img src="/images/range-rover-villars.jpg" className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
                                                </div>
                                            </p>
                                        </div>
                                    </div>
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
                                src="/images/caueh-vidal-spring.jpg"
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

                {/* Investment Section - Interactive */}
                <section id="investment" className="bg-neutral-900 border border-white/5 p-8 md:p-20 mb-24 relative overflow-hidden group rounded-sm shadow-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-switz-red/10 to-transparent pointer-events-none opacity-50" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                        <div>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase block mb-10">
                                Requisito de Entrada
                            </span>
                            <h2 className="text-6xl font-serif text-white mb-8 tracking-tighter italic">Investimento.</h2>

                            <div className="mb-16">
                                <div className="text-9xl font-serif text-white tracking-tighter mb-4 italic">£{finalPrice}</div>
                                <div className="flex items-center gap-6">
                                    {addonsTotal > 0 && <span className="text-white/20 text-2xl line-through font-serif italic">£{selectedTier}</span>}
                                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.3em] bg-switz-red/10 border border-switz-red/20 px-4 py-2 flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-switz-red animate-pulse" /> Private Intake Confirmed
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8 mb-16">
                                <div className="flex items-center gap-5 text-white/70 group/item">
                                    <Check className="w-6 h-6 text-switz-red" />
                                    <span className="text-base font-light italic group-hover:text-white transition-colors tracking-tight">{selectedTier === 1350 ? "Experiência Individual VIP" : `${selectedTier === 2000 ? "2 Pessoas" : selectedTier === 2400 ? "3 Pessoas" : "4 Pessoas"} em Grupo`}</span>
                                </div>
                                {selectedAddons.length > 0 && (
                                    <div className="flex items-center gap-5 text-white/70 group/item">
                                        <Check className="w-6 h-6 text-switz-red" />
                                        <span className="text-base font-light italic group-hover:text-white transition-colors tracking-tight">Incluindo: {selectedAddons.map(id => addOns.find(a => a.id === id)?.label).join(", ")}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => window.location.href = `/secure-deposit?intent=Alex_Proposal&tier=Private_Intake_Total_£${finalPrice}`}
                                className="bg-white text-black px-12 py-6 uppercase tracking-[0.4em] text-[12px] font-bold hover:bg-switz-red hover:text-white transition-all duration-1000 flex items-center justify-center gap-6 group w-full shadow-2xl"
                            >
                                Secure Your Intake
                                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform duration-700" />
                            </button>

                            <div className="mt-10 flex flex-col items-center gap-6">
                                <p className="text-[11px] text-white/20 uppercase tracking-[0.3em] italic text-center leading-relaxed">A emissão da invoice formal ocorre após a <br /> reserva do depósito de compromisso.</p>
                                <a
                                    href={`mailto:caueh@swissperiences.ch?subject=Dúvidas Proposta Alex - Total £${finalPrice}`}
                                    className="text-[11px] text-white/40 hover:text-switz-red transition-all duration-500 uppercase tracking-[0.4em] border-b border-white/5 hover:border-switz-red pb-2 font-bold"
                                >
                                    Falar com Caueh (Dúvidas?)
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
            <Footer />
        </div>
    );
}
