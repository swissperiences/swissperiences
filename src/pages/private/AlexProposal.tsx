
import { ArrowRight, Check, Calendar, Lock, Users, Camera, Mountain, Train } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function AlexProposal() {
    const proposalDetails = {
        clientName: "Alex",
        dates: "Proposto: Fev 2026",
        priceSolo: "£1,350",
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-switz-red selection:text-white">
            <Navigation onWaitlistClick={() => window.location.href = "mailto:caueh@swissperiences.ch?subject=Confirming Alex Proposal"} />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">

                {/* Header Section */}
                <section className="mb-24 relative">
                    <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-6 animate-fade-in">
                        Proposta Privada // Ref: #001-A
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] animate-fade-in delay-100">
                        The Silent Alps <br /> para <span className="italic text-white/50">{proposalDetails.clientName}</span>.
                    </h1>
                    <p className="text-xl text-white/60 font-light max-w-2xl leading-relaxed animate-fade-in delay-200">
                        "Alex, desenhei este protocolo para desligar o ruído logo após a nossa chegada. O foco é reset mental, conteúdo cinematográfico e a realização do sonho do ski."
                    </p>
                </section>

                {/* The Itinerary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-16 mb-32">

                    {/* Sidebar Details */}
                    <div className="md:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Datas</h3>
                            <div className="flex items-center gap-3 text-lg">
                                <Calendar className="w-4 h-4 text-switz-red" />
                                {proposalDetails.dates}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Inclusões</h3>
                            <ul className="space-y-3 text-white/80 font-light text-sm">
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Transfer Range Rover (Geneva-Villars)</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Hospedagem "Villars Loft"</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Drone & Fotos Profissionais</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Logística Ski e Equipamento</li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Itinerary */}
                    <div className="md:col-span-8 space-y-16">

                        {/* Day 1 */}
                        <div className="relative pl-8 md:pl-12 border-l border-white/10 pb-12 group">
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-switz-red group-hover:border-switz-red transition-colors" />
                            <h3 className="text-3xl font-serif mb-2 text-white">Dia 01: A Subida</h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest mb-6">Geneva - Montreux - Villars</p>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">A chegada</span>
                                        <Lock className="w-3 h-3 text-white/20" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Recepção Cinematográfica</h4>
                                    <p className="text-white/60 text-sm font-light">Te busco de Range Rover na estação/aeroporto. Parada estratégica no Jet d'Eau e ONU para fotos iniciais.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">O Caminho</span>
                                        <Camera className="w-3 h-3 text-white/20" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Montreux & Lago Léman</h4>
                                    <p className="text-white/60 text-sm font-light">Parada em Montreux para sessão de drone no cenário de cinema do lago. Subida para Villars.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">A Noite</span>
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Descompressão</h4>
                                    <p className="text-white/60 text-sm font-light">Relaxamento no Spa Termal e noite de sono absoluto no silêncio dos Alpes.</p>
                                </div>
                            </div>
                        </div>

                        {/* Day 2 */}
                        <div className="relative pl-8 md:pl-12 border-l border-white/10 group">
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-switz-red group-hover:border-switz-red transition-colors" />
                            <h3 className="text-3xl font-serif mb-2 text-white">Dia 02: O Sonho</h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest mb-6">Ski & Drone</p>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">A Ação</span>
                                        <Mountain className="w-3 h-3 text-white/20" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Ski Experience</h4>
                                    <p className="text-white/60 text-sm font-light">Equipamento e aula esquematizados. Descida filmada com drone no topo da montanha para garantir o registro.</p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">O Retorno</span>
                                        <Train className="w-3 h-3 text-white/20" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Almoço & Retorno</h4>
                                    <p className="text-white/60 text-sm font-light">Almoço alpino de qualidade. Transfer para a estação de trem em Genebra no fim da tarde.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Investment Section */}
                <section className="bg-neutral-900 border border-white/5 p-8 md:p-12 mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-6">
                                Opções de Investimento
                            </span>
                            <h2 className="text-3xl font-serif text-white mb-4">Experiência VIP Solo</h2>
                            <div className="text-5xl font-serif text-white mb-2">£1,350</div>
                            <p className="text-white/40 text-sm mb-8">Experiência completa e exclusiva para você.</p>

                            <button
                                onClick={() => window.location.href = "mailto:caueh@swissperiences.ch?subject=Aceito Proposta Alex - Solo"}
                                className="bg-white text-black px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group w-full md:w-auto"
                            >
                                Confirmar Solo
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        <div className="bg-white/5 p-8 rounded-sm border border-white/5">
                            <h3 className="text-xl font-serif text-white mb-6">Bring Your Friends</h3>
                            <p className="text-white/60 text-sm font-light mb-6">
                                O apê e a Range Rover comportam até 4 pessoas. Se trazer amigos, a vibe melhora e o valor dilui.
                            </p>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-switz-red" />
                                        <span className="text-white/80">2 Pessoas</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-white font-serif text-lg">£1,000 <span className="text-xs text-white/40">/cada</span></span>
                                        <span className="text-[10px] text-white/30">Total: £2,000</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-switz-red" />
                                        <span className="text-white/80">3 Pessoas</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-white font-serif text-lg">£800 <span className="text-xs text-white/40">/cada</span></span>
                                        <span className="text-[10px] text-white/30">Total: £2,400</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Users className="w-4 h-4 text-switz-red" />
                                        <span className="text-white/80">4 Pessoas</span>
                                        <span className="bg-switz-red/20 text-switz-red text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">Best Value</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-white font-serif text-lg">£700 <span className="text-xs text-white/40">/cada</span></span>
                                        <span className="text-[10px] text-white/30">Total: £2,800</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = "mailto:caueh@swissperiences.ch?subject=Aceito Proposta Alex - Grupo"}
                                className="mt-8 w-full border border-white/20 text-white px-6 py-3 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-white hover:text-black transition-all duration-500"
                            >
                                Confirmar para Grupo
                            </button>
                        </div>

                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
