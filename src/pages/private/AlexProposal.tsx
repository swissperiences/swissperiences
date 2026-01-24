import { useState } from "react";
import { ArrowRight, Check, Calendar, Lock, Users, Camera, Mountain, Train, Plus, ShieldCheck, MapPin, Instagram } from "lucide-react";
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
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-switz-red selection:text-white">
            <Navigation onWaitlistClick={() => window.location.href = `mailto:caueh@swissperiences.ch?subject=Confirming Alex Proposal (£${finalPrice})`} />

            <main className="pt-24 pb-16 px-5 md:px-12 max-w-5xl mx-auto">

                {/* Header Section */}
                <section className="mb-24 relative">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase animate-fade-in">
                            Proposta Privada // Ref: #001-A
                        </span>
                        <div className="h-px w-8 bg-switz-red/30" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif text-white mb-8 leading-[1.1] animate-fade-in delay-100">
                        The Silent Alps <br /> para <span className="italic text-white/50">{proposalDetails.clientName}</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl leading-relaxed animate-fade-in delay-200">
                        "Alex, desenhei este protocolo para desligar o ruído de Londres. O foco é um reset mental profundo, conteúdo cinematográfico e a realização do sonho do ski. Você volta não apenas descansado, mas <span className="text-white italic">revigorado</span> e focado no essencial."
                    </p>
                    <div className="mt-8 p-6 bg-switz-red/5 border-l-2 border-switz-red max-w-2xl">
                        <p className="text-sm text-switz-red/80 font-medium italic">
                            "Londres é excelente para fazer dinheiro, mas cobra caro da nossa alma. O que desenhei aqui não é turismo, é um resgate. Um santuário para limpar o sistema, dormir sono profundo e recuperar a energia que a cidade drena."
                        </p>
                    </div>
                </section>

                {/* Image Narrative: Beyond the Grid */}
                <section className="mb-32">
                    <div className="relative aspect-[21/9] w-full overflow-hidden rounded-sm mb-4 group shadow-2xl">
                        <img src="/images/glacier3000.avif" alt="Glacier 3000" className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110 brightness-75 group-hover:brightness-90" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                            <div>
                                <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase mb-2 block">Peak State</span>
                                <h3 className="text-3xl font-serif text-white italic">Glacier 3000 Peak Walk.</h3>
                            </div>
                            <span className="text-[9px] uppercase tracking-widest text-white/40 hidden md:block">by Tissot</span>
                        </div>
                    </div>
                </section>

                {/* The Residence: The Loft Visuals */}
                <section className="mb-32">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center">
                        <span>The Residence (The Villars Loft)</span>
                        <a href="/villars-retreat" target="_blank" className="text-[10px] uppercase tracking-widest text-switz-red hover:text-white transition-colors flex items-center gap-2">
                            Explore Full Residence <ArrowRight className="w-3 h-3" />
                        </a>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:h-[600px]">
                        <div className="md:col-span-8 relative overflow-hidden rounded-sm group h-[400px] md:h-full">
                            <img src="/images/villars-hero.jpg" alt="Living Room" className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            <div className="absolute bottom-8 left-8">
                                <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">Atmosphere</span>
                                <h4 className="text-2xl font-serif text-white italic">Seu QG nos Alpes.</h4>
                            </div>
                        </div>

                        <div className="md:col-span-4 flex flex-col gap-4">
                            <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[200px]">
                                <img src="/images/loft/IMG_8736.jpg" alt="Details" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 text-[9px] uppercase tracking-widest text-white/80">
                                    Curated Space
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden rounded-sm group min-h-[200px]">
                                <img src="/images/villars-feature.jpg" alt="Fireplace" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute bottom-4 left-4">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Wood Fireplace</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-1">Starlink WiFi</span>
                            <p className="text-[10px] text-white/40">Conexão estável para o que for necessário.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-1">Sonos System</span>
                            <p className="text-[10px] text-white/40">Fidelidade sonora em todos os ambientes.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-sm">
                            <span className="text-switz-red text-[9px] font-bold uppercase tracking-widest block mb-1">Cozinha Chef</span>
                            <p className="text-[10px] text-white/40">Totalmente equipada para o ritual alpino.</p>
                        </div>
                        <a href="/villars-retreat" target="_blank" className="bg-white/5 border border-white/10 p-4 rounded-sm flex items-center justify-center group cursor-pointer">
                            <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-switz-red transition-colors">See 20+ Photos <ArrowRight className="inline w-3 h-3 ml-2" /></span>
                        </a>
                    </div>
                </section>

                {/* Social Proof: The Archives */}
                <section className="mb-32">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-12 border-b border-white/10 pb-4 flex justify-between items-center">
                        <span>The Archives (Proven Track Record)</span>
                        <span className="text-[10px] font-normal lowercase tracking-normal">Past Guest Journeys</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Entry 1: Ale & Alex */}
                        <div className="group cursor-pointer" onClick={() => window.open('/journals', '_blank')}>
                            <div className="relative aspect-video overflow-hidden rounded-sm mb-6 border border-white/10">
                                <img src="/images/guests/ale_alex/3.jpg" alt="Ale & Alex Journey" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <span className="text-switz-red text-[10px] font-bold uppercase tracking-widest block mb-2">The Alpine Protocol // Ale & Alex</span>
                            <p className="text-white/60 text-sm font-light leading-relaxed italic">
                                "Precision meets the peak state. Um mergulho no silêncio dos Alpes de Villars com resultado cinematográfico."
                            </p>
                        </div>

                        {/* Entry 2: Wager family */}
                        <div className="group cursor-pointer" onClick={() => window.open('/journals', '_blank')}>
                            <div className="relative aspect-video overflow-hidden rounded-sm mb-6 border border-white/10">
                                <img src="/images/guests/wager/uploaded_image_1_1769163527795.jpg" alt="Wager Journey" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <span className="text-switz-red text-[10px] font-bold uppercase tracking-widest block mb-2">The Winter Ascent // Wager & Family</span>
                            <p className="text-white/60 text-sm font-light leading-relaxed italic">
                                "Uma experiência condensada de 48h pelo Grand Tour. Do urban luxury às montanhas de Grindelwald."
                            </p>
                        </div>
                    </div>
                </section>

                {/* The Itinerary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-16 mb-32">

                    {/* Left: Interactive Controls */}
                    <div className="md:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6 flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-switz-red" />
                                Janela de Execução
                            </h3>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-sm">
                                <p className="text-lg text-white/90">{proposalDetails.dates}</p>
                                <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1 block">A confirmação bloqueia o Loft</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-6">Configuração do Grupo</h3>
                            <div className="space-y-2">
                                {tiers.map((tier) => (
                                    <div
                                        key={tier.count}
                                        onClick={() => setSelectedTier(tier.total)}
                                        className={cn(
                                            "flex justify-between items-center p-4 rounded-sm border transition-all duration-300 cursor-pointer",
                                            selectedTier === tier.total
                                                ? "bg-switz-red/10 border-switz-red"
                                                : "bg-white/5 border-transparent hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Users className={cn("w-4 h-4", selectedTier === tier.total ? "text-switz-red" : "text-white/20")} />
                                            <div>
                                                <span className={cn("text-xs font-bold tracking-wider", selectedTier === tier.total ? "text-white" : "text-white/40")}>
                                                    {tier.label}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-white font-serif text-sm">£{tier.price} <small className="text-[10px] text-white/40 opacity-70">/cada</small></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-switz-red mb-6 uppercase flex items-center gap-2">
                                <Plus className="w-3 h-3" /> Customize
                            </h3>
                            <div className="space-y-4">
                                {addOns.map((addon) => (
                                    <div
                                        key={addon.id}
                                        onClick={() => toggleAddon(addon.id)}
                                        className={cn(
                                            "cursor-pointer p-4 rounded-sm border transition-all duration-300",
                                            selectedAddons.includes(addon.id)
                                                ? "bg-switz-red/10 border-switz-red"
                                                : "bg-black/20 border-white/5 hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className={cn(
                                                "text-xs font-bold tracking-wider uppercase",
                                                selectedAddons.includes(addon.id) ? "text-switz-red" : "text-white/60"
                                            )}>{addon.label}</span>
                                        </div>
                                        <p className="text-[10px] text-white/40 mb-2">{addon.description}</p>
                                        <span className="text-xs font-serif italic">+ £{addon.price}</span>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-[10px] text-white/33 italic leading-relaxed">
                                        *Logística de Ski e Instrutor já inclusos no pacote base. <br />
                                        *Sessões de drone sujeitas a condições meteorológicas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: The Process (Itinerary) */}
                    <div className="md:col-span-8 space-y-20">
                        {/* Summary of Inclusions */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-8 bg-white/5 border border-white/10 rounded-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck className="w-16 h-16 text-switz-red" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Transfer</span>
                                <p className="text-xs text-white/80">Range Rover Private</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Safe Zone</span>
                                <p className="text-xs text-white/80">Portuguese Host</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">Artifacts</span>
                                <p className="text-xs text-white/80">Prof. Photo/Video</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-widest text-switz-red font-bold">The Loft</span>
                                <p className="text-xs text-white/80">Residence Only</p>
                            </div>
                        </div>

                        {/* Day 1 */}
                        <div className="relative pl-12 border-l border-white/10 group">
                            <span className="absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full bg-switz-red shadow-[0_0_15px_rgba(255,46,46,0.3)] transition-all duration-500 group-hover:scale-125" />
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 block">Day 01 // The Reset</span>
                            <h3 className="text-4xl font-serif text-white mb-8 border-b border-white/5 pb-4">A Porta de Saída.</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all">
                                        <div className="mt-1"><MapPin className="w-4 h-4 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Gate Pickup</h4>
                                            <p className="text-xs text-white/50 leading-relaxed font-light italic">Vou te buscar diretamente no portão do TGV ou aeroporto. Desse momento em diante, o barulho do mundo diminui. O idioma oficial da viagem é o seu.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all">
                                        <div className="mt-1"><Camera className="w-4 h-4 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Montreux Session</h4>
                                            <p className="text-xs text-white/50 leading-relaxed font-light italic">Uma pausa estratégica nas margens do Lago Léman. O ar gelado e a água cristalina começam o processo de limpeza antes de subirmos ao santuário.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all h-full">
                                        <div className="mt-1"><Lock className="w-4 h-4 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">The Sanctuary</h4>
                                            <p className="text-xs text-white/50 leading-relaxed font-light italic">Check-in no Villars Loft. Fogo na lareira, spa termal à disposição e o primeiro sono profundo que você experimenta em meses.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Day 2 */}
                        <div className="relative pl-12 border-l border-white/10 group">
                            <span className="absolute -left-[5px] top-0 w-[10px] h-[10px] rounded-full bg-white/20 border border-white/10 group-hover:bg-switz-red transition-all duration-500" />
                            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 block">Day 02 // The Peak State</span>
                            <h3 className="text-4xl font-serif text-white mb-8 border-b border-white/5 pb-4">O Silêncio Absoluto.</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all">
                                        <div className="mt-1"><Mountain className="w-4 h-4 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">Ski High Intent</h4>
                                            <p className="text-xs text-white/50 leading-relaxed font-light italic text-white/80">Aula privada de evolução rápida. Enquanto você conquista a montanha, capturamos cada curva com drone para eternizar o seu progresso.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-sm hover:border-white/20 transition-all">
                                        <div className="mt-1"><Train className="w-4 h-4 text-switz-red" /></div>
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest mb-2">The Essential Return</h4>
                                            <p className="text-xs text-white/50 leading-relaxed font-light italic text-white/80">Um almoço que conecta com o essencial em um local secreto dos Alpes. Você volta para Londres não apenas descansado, mas revigorado e focado no que importa.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* About the Host */}
                <section className="mb-32 grid grid-cols-1 md:grid-cols-12 gap-12 items-center border-t border-white/10 pt-32">
                    <div className="md:col-span-5 relative group">
                        <div className="aspect-[3/4] bg-neutral-900 rounded-sm overflow-hidden border border-white/5">
                            <img
                                src="/images/caueh-vidal-spring.jpg"
                                alt="Caueh Vidal"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-neutral-900 p-8 border border-white/10 hidden md:block text-right">
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">Direct Support</span>
                            <span className="text-white font-serif text-2xl italic tracking-tight">Caueh Vidal.</span>
                        </div>
                    </div>
                    <div className="md:col-span-1 md:col-start-7 md:col-span-6 space-y-8">
                        <div>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-4">Host Residency</span>
                            <h2 className="text-5xl font-serif text-white italic">Seu vizinho <br /> de montanha.</h2>
                        </div>

                        <div className="p-6 bg-switz-red/5 border border-switz-red/20 rounded-sm">
                            <p className="text-switz-red text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-switz-red animate-pulse" /> Multilingual Support
                            </p>
                            <p className="text-white/80 font-light text-sm italic leading-relaxed">
                                "Aqui você fala Português. Eu resolvo o Francês e o Inglês por você. Minha missão é garantir que a logística seja invisível e a execução seja impecável."
                            </p>
                        </div>

                        <p className="text-white/60 font-light leading-relaxed text-lg italic">
                            "Não sou uma agência de viagens. Sou um arquiteto de experiências residente na Suíça. Eu cuido do backstage para que você foque apenas em respirar."
                        </p>

                        <a href="https://instagram.com/caueh" target="_blank" className="inline-flex items-center gap-3 text-white/40 hover:text-switz-red transition-colors text-sm uppercase tracking-widest group">
                            <Instagram className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            @caueh
                        </a>
                    </div>
                </section>

                {/* Investment Section - Interactive */}
                <section id="investment" className="bg-neutral-900 border border-white/5 p-8 md:p-16 mb-24 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-switz-red/5 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
                        <div>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.4em] uppercase block mb-8">
                                Requisito de Entrada
                            </span>
                            <h2 className="text-5xl font-serif text-white mb-6 tracking-tight">Investimento.</h2>

                            <div className="mb-12">
                                <div className="text-8xl font-serif text-white tracking-tighter mb-2">£{finalPrice}</div>
                                <div className="flex items-center gap-4">
                                    {addonsTotal > 0 && <span className="text-white/30 text-xl line-through font-serif">£{selectedTier}</span>}
                                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-widest bg-switz-red/10 px-2 py-1 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-switz-red" /> Private Intake
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 mb-12">
                                <div className="flex items-center gap-3 text-white/60">
                                    <Check className="w-5 h-5 text-switz-red" />
                                    <span className="text-sm font-light italic">Confirmado: {selectedTier === 1350 ? "Experiência Individual VIP" : `${selectedTier === 2000 ? "2 Pessoas" : selectedTier === 2400 ? "3 Pessoas" : "4 Pessoas"} em Grupo`}</span>
                                </div>
                                {selectedAddons.length > 0 && (
                                    <div className="flex items-center gap-3 text-white/60">
                                        <Check className="w-5 h-5 text-switz-red" />
                                        <span className="text-sm font-light italic">Incluindo: {selectedAddons.map(id => addOns.find(a => a.id === id)?.label).join(", ")}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => window.location.href = `/secure-deposit?intent=Alex_Proposal&tier=Private_Intake_Total_£${finalPrice}`}
                                className="bg-white text-black px-12 py-5 uppercase tracking-[0.3em] text-[11px] font-bold hover:bg-switz-red hover:text-white transition-all duration-700 flex items-center justify-center gap-4 group w-full"
                            >
                                Secure Your Intake
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                            <div className="mt-8 flex flex-col items-center gap-4">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest italic text-center">A emissão da invoice formal ocorre após a reserva do depósito.</p>
                                <a
                                    href={`mailto:caueh@swissperiences.ch?subject=Dúvidas Proposta Alex - Total £${finalPrice}`}
                                    className="text-[10px] text-white/40 hover:text-switz-red transition-colors uppercase tracking-widest border-b border-white/10 pb-1"
                                >
                                    Falar com Caueh (Dúvidas?)
                                </a>
                            </div>
                        </div>

                        <div className="hidden lg:flex flex-col justify-center">
                            <div className="p-10 bg-white/5 border border-white/10 rounded-sm backdrop-blur-sm relative overflow-hidden group-hover:border-white/20 transition-all">
                                <div className="absolute top-0 left-0 w-1 h-full bg-switz-red opacity-50" />
                                <h3 className="text-2xl font-serif text-white mb-6 italic italic">A logística é nossa. <br /> O silêncio é seu.</h3>
                                <ul className="space-y-5">
                                    <li className="flex items-center gap-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">
                                        <div className="w-2 h-[2px] bg-switz-red" /> Sem burocracia de hotel
                                    </li>
                                    <li className="flex items-center gap-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">
                                        <div className="w-2 h-[2px] bg-switz-red" /> Sem barreiras de idioma
                                    </li>
                                    <li className="flex items-center gap-4 text-white/40 text-[10px] tracking-[0.2em] uppercase font-bold">
                                        <div className="w-2 h-[2px] bg-switz-red" /> Sem stress de transporte
                                    </li>
                                </ul>
                                <div className="mt-12 flex justify-between items-end">
                                    <ShieldCheck className="w-8 h-8 text-switz-red opacity-30" />
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] text-white/20 uppercase tracking-widest">Swiss Quality</span>
                                        <img src="/images/swiss-quality.png" alt="Swiss Quality" className="h-4 w-auto grayscale opacity-20" />
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
