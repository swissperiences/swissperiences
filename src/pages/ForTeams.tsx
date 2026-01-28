import Navigation from "@/components/Navigation";
import CorporateRetreats from "@/components/CorporateRetreats";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import TeamsVideoBackground from "@/components/TeamsVideoBackground";
import { CorporateInquiryForm } from "@/components/CorporateInquiryForm";
import SEO from "@/components/SEO";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const ForTeams = () => {
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Corporate Retreats in Switzerland",
        "provider": {
            "@type": "TravelAgency",
            "name": "Swissperiences"
        },
        "description": "Tailored corporate retreats and team experiences in the Swiss Alps. Strengthen team bonds through authentic Swiss experiences.",
        "areaServed": "Switzerland",
        "availableLanguage": ["en"]
    };

    return (
        <div className="min-h-screen bg-background relative">
            <SEO
                title="Corporate Retreats Switzerland | Swissperiences for Teams"
                description="Tailored corporate retreats and team experiences in the Swiss Alps. Strengthen team bonds through authentic Swiss experiences. Perfect for team building and corporate offsites."
                keywords="corporate retreats switzerland, team building switzerland, swiss alps corporate events, company retreats switzerland, team offsites geneva, corporate team building"
                canonical="https://swissperiences.ch/for-teams"
                structuredData={structuredData}
            />
            {/* Global video background for entire page */}
            <TeamsVideoBackground />

            {/* All content with relative positioning */}
            <div className="relative z-10">
                <Navigation onWaitlistClick={() => setIsWaitlistOpen(true)} />
                <main className="pt-20">
                    <CorporateRetreats />

                    {/* Inquiry Form Section */}
                    <section className="relative py-24 px-6 md:px-12">
                        <div className="absolute inset-0 bg-black/60" /> {/* Darker overlay for form readability */}
                        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                            {/* Left Column: Context */}
                            <div className="space-y-12 sticky top-32">
                                <div>
                                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">Why Swissperiences?</span>
                                    <h2 className="text-5xl font-serif text-white italic leading-tight mb-8">
                                        Not just a trip. <br /> A strategic reset.
                                    </h2>
                                    <p className="text-white/60 font-light text-lg leading-relaxed max-w-md">
                                        We move your team from the noise of the office to the silence of the Alps. Deep work sessions in the morning, glacier expeditions in the afternoon.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl text-white/10 font-serif italic">01</span>
                                        <div>
                                            <h4 className="text-white text-lg font-serif mb-2">Total Privacy</h4>
                                            <p className="text-white/50 text-sm font-light">Dedicated chalets and private transfers. No unwanted interruptions.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl text-white/10 font-serif italic">02</span>
                                        <div>
                                            <h4 className="text-white text-lg font-serif mb-2">Precision Logistics</h4>
                                            <p className="text-white/50 text-sm font-light">From heli-pickups to dietary needs, every detail is engineered.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-6 items-start">
                                        <span className="text-4xl text-white/10 font-serif italic">03</span>
                                        <div>
                                            <h4 className="text-white text-lg font-serif mb-2">High-Stakes Ready</h4>
                                            <p className="text-white/50 text-sm font-light">Accustomed to hosting C-Level executives and high-performance teams.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Form */}
                            <div>
                                <CorporateInquiryForm />
                            </div>
                        </div>
                    </section>

                    {/* Corporate FAQ Section */}
                    <section className="relative py-24 px-6 bg-black/20 backdrop-blur-sm">
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-light text-center mb-12 text-white font-serif italic">Common Questions</h3>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem
                                    value="item-1"
                                    className="border-white/10 hover:bg-white/5 transition-colors duration-200 px-6 rounded-sm mb-4"
                                >
                                    <AccordionTrigger className="text-white text-left text-base uppercase tracking-widest font-bold hover:no-underline py-6">
                                        Can I customize for my corporate team?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60 text-base leading-relaxed pb-6 font-light">
                                        Absolutely. We design bespoke retreats for teams of 10-120 participants. Whether you need a boardroom in a bunker or a brainstorm on a peak, we make it happen.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-2"
                                    className="border-white/10 hover:bg-white/5 transition-colors duration-200 px-6 rounded-sm mb-4"
                                >
                                    <AccordionTrigger className="text-white text-left text-base uppercase tracking-widest font-bold hover:no-underline py-6">
                                        Are these always multi-day retreats?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60 text-base leading-relaxed pb-6 font-light">
                                        No. While we recommend 3-4 days for maximum impact, we also execute single-day "Strategic Offsites" for Geneva/Lausanne based companies.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-3"
                                    className="border-white/10 hover:bg-white/5 transition-colors duration-200 px-6 rounded-sm"
                                >
                                    <AccordionTrigger className="text-white text-left text-base uppercase tracking-widest font-bold hover:no-underline py-6">
                                        What is the lead time?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/60 text-base leading-relaxed pb-6 font-light">
                                        For comprehensive retreats, we recommend 3-6 months. For simpler offsites, 4 weeks is sufficient.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>

            <WaitlistModal
                open={isWaitlistOpen}
                onOpenChange={setIsWaitlistOpen}
            />
        </div>
    );
};

export default ForTeams;
