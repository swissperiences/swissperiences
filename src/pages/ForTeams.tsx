import Navigation from "@/components/Navigation";
import CorporateRetreats from "@/components/CorporateRetreats";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import TeamsVideoBackground from "@/components/TeamsVideoBackground";
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
                <div className="pt-20">
                    <CorporateRetreats />

                    {/* Corporate FAQ Section */}
                    <section className="relative py-12 px-6">
                        {/* Overlay for FAQ section */}
                        <div className="absolute inset-0 bg-black/40" />

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-light text-center mb-8 text-white">Common Questions</h3>
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem
                                    value="item-1"
                                    className="border-white/20 hover:bg-white/10 transition-colors duration-200 px-4 rounded-lg"
                                >
                                    <AccordionTrigger className="text-white text-left text-lg font-medium hover:no-underline py-6">
                                        Can I customize for my corporate team?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                                        Absolutely. We design bespoke retreats for teams of 10-120 participants.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem
                                    value="item-2"
                                    className="border-white/20 hover:bg-white/10 transition-colors duration-200 px-4 rounded-lg"
                                >
                                    <AccordionTrigger className="text-white text-left text-lg font-medium hover:no-underline py-6">
                                        Are these always multi-day retreats?
                                    </AccordionTrigger>
                                    <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                                        No. Some teams choose immersive retreats, while others prefer shorter or seasonal formats. Each experience is designed around the team's objective — not a predefined structure.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </section>
                </div>
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
