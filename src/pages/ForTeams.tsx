import Navigation from "@/components/Navigation";
import CorporateRetreats from "@/components/CorporateRetreats";
import Footer from "@/components/Footer";
import { WaitlistModal } from "@/components/WaitlistModal";
import { useState } from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const ForTeams = () => {
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <Navigation onWaitlistClick={() => setIsWaitlistOpen(true)} />
            <div className="pt-20">
                <CorporateRetreats />

                {/* Corporate FAQ Section */}
                <section className="bg-background py-12 px-6">
                    <div className="max-w-3xl mx-auto">
                        <h3 className="text-2xl font-light text-center mb-8">Common Questions</h3>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem
                                value="item-1"
                                className="border-border/30 hover:bg-secondary/30 transition-colors duration-200 px-4 rounded-lg"
                            >
                                <AccordionTrigger className="text-foreground text-left text-lg font-medium hover:no-underline py-6">
                                    Can I customize for my corporate team?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    Absolutely. We design bespoke retreats for teams of 10-120 participants.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem
                                value="item-2"
                                className="border-border/30 hover:bg-secondary/30 transition-colors duration-200 px-4 rounded-lg"
                            >
                                <AccordionTrigger className="text-foreground text-left text-lg font-medium hover:no-underline py-6">
                                    Are these always multi-day retreats?
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                                    No. Some teams choose immersive retreats, while others prefer shorter or seasonal formats. Each experience is designed around the team’s objective — not a predefined structure.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </section>
            </div>
            <Footer />
            <WaitlistModal
                open={isWaitlistOpen}
                onOpenChange={setIsWaitlistOpen}
            />
        </div>
    );
};

export default ForTeams;
