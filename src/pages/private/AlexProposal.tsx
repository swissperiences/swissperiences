
import { ArrowRight, Check, Calendar, Lock } from "lucide-react";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";

export default function AlexProposal() {
    const proposalDetails = {
        clientName: "Alex",
        dates: "Proposed: Feb 21 - Feb 23, 2026",
        totalPrice: "CHF 3,450",
        deposit: "CHF 1,700",
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-switz-red selection:text-white">
            <Navigation onWaitlistClick={() => window.location.href = "mailto:caueh@swissperiences.ch?subject=Confirming Alex Proposal"} />

            <main className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">

                {/* Header Section */}
                <section className="mb-24 relative">
                    <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-6 animate-fade-in">
                        Private Proposal // Ref: #001-A
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-[1.1] animate-fade-in delay-100">
                        The Silent Alps <br /> for <span className="italic text-white/50">{proposalDetails.clientName}</span>.
                    </h1>
                    <p className="text-xl text-white/60 font-light max-w-2xl leading-relaxed animate-fade-in delay-200">
                        "Alex, you mentioned you needed silence. I designed this protocol to turn off the noise only 2 hours after landing."
                    </p>
                </section>

                {/* The Itinerary Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-white/10 pt-16 mb-32">

                    {/* Sidebar Details */}
                    <div className="md:col-span-4 space-y-12">
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Dates</h3>
                            <div className="flex items-center gap-3 text-lg">
                                <Calendar className="w-4 h-4 text-switz-red" />
                                {proposalDetails.dates}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-4">Inclusions</h3>
                            <ul className="space-y-3 text-white/80 font-light">
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> S-Class Airport Transfers</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> 2 Nights Villars Loft</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Private Chef Dinner</li>
                                <li className="flex items-start gap-3"><Check className="w-4 h-4 text-switz-red mt-1 shrink-0" /> Glacier 3000 VIP Access</li>
                            </ul>
                        </div>
                    </div>

                    {/* Main Itinerary */}
                    <div className="md:col-span-8 space-y-16">

                        {/* Day 1 */}
                        <div className="relative pl-8 md:pl-12 border-l border-white/10 pb-12 group">
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-switz-red group-hover:border-switz-red transition-colors" />
                            <h3 className="text-3xl font-serif mb-2 text-white">Day 01: Decompression</h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest mb-6">Arrival & Reset</p>

                            <div className="space-y-6">
                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">14:00</span>
                                        <Lock className="w-3 h-3 text-white/20" />
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Private Transfer</h4>
                                    <p className="text-white/60 text-sm font-light">Mercedes S-Class pickup at GVA. Direct scenic route to Villars-sur-Ollon.</p>
                                </div>

                                <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-switz-red font-mono text-xs">19:00</span>
                                    </div>
                                    <h4 className="text-lg font-medium mb-1">Chef's Table: In-Chalet</h4>
                                    <p className="text-white/60 text-sm font-light">Private chef serving Raclette de Montagne & Local Gamay wines. Fireplace lit upon arrival.</p>
                                </div>
                            </div>
                        </div>

                        {/* Day 2 */}
                        <div className="relative pl-8 md:pl-12 border-l border-white/10 pb-12 group">
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-switz-red group-hover:border-switz-red transition-colors" />
                            <h3 className="text-3xl font-serif mb-2 text-white">Day 02: Immersion</h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest mb-6">The High Alps</p>

                            <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-switz-red font-mono text-xs">10:00 - 14:00</span>
                                </div>
                                <h4 className="text-lg font-medium mb-1">Private Road Journey</h4>
                                <p className="text-white/60 text-sm font-light">Range Rover experience to Glacier 3000. VIP Access to the suspension bridge before public hours.</p>
                            </div>
                        </div>

                        {/* Day 3 */}
                        <div className="relative pl-8 md:pl-12 border-l border-white/10 group">
                            <span className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-neutral-800 border border-white/20 group-hover:bg-switz-red group-hover:border-switz-red transition-colors" />
                            <h3 className="text-3xl font-serif mb-2 text-white">Day 03: Return</h3>
                            <p className="text-white/40 text-sm uppercase tracking-widest mb-6">Integration</p>

                            <div className="bg-white/5 p-6 rounded-sm border border-white/5 hover:border-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-switz-red font-mono text-xs">13:00</span>
                                </div>
                                <h4 className="text-lg font-medium mb-1">Departure</h4>
                                <p className="text-white/60 text-sm font-light">Late checkout authorized. Transfer back to Geneva Airport.</p>
                            </div>
                        </div>


                    </div>
                </div>

                {/* Investment Section */}
                <section className="bg-neutral-900 border border-white/5 p-8 md:p-12 mb-24">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                        <div>
                            <span className="text-switz-red text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">
                                Total Investment
                            </span>
                            <div className="text-5xl font-serif text-white">{proposalDetails.totalPrice}</div>
                            <p className="text-white/40 text-sm mt-2">All taxes and fees included.</p>
                        </div>

                        <div className="flex flex-col gap-4 w-full md:w-auto">
                            <button
                                onClick={() => window.location.href = "mailto:caueh@swissperiences.ch?subject=Confirming Alex Proposal"}
                                className="bg-white text-black px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 flex items-center justify-center gap-3 group"
                            >
                                Accept & Pay Service Deposit
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-white/30 text-[10px] uppercase tracking-wider">
                                Deposit Required: {proposalDetails.deposit}
                            </p>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
