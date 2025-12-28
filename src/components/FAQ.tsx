import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "When will experiences launch?",
    answer: "Spring 2026. Waitlist members get first access.",
  },
  {
    question: "What's included in a retreat?",
    answer: "Accommodation, meals, guided activities, and full support.",
  },
  {
    question: "How are experiences selected?",
    answer: "Every location and host is personally vetted. We prioritize quality over quantity—expect 15-20 exceptional experiences, not hundreds.",
  },

  {
    question: "What makes this different?",
    answer: "No screens, no performance pressure, no content creation. Just authentic Swiss experiences designed for presence, not productivity.",
  },
];

export default function FAQ() {
  return (
    <section className="relative bg-background py-24 px-6 overflow-hidden" aria-labelledby="faq-title">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
        >
          <source src="/hero-video-v2.mp4" type="video/mp4" />
        </video>
        {/* Light overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-muted-foreground text-center mb-12">
          Frequently Asked Questions
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border-border/30 hover:bg-secondary/30 transition-colors duration-200 px-4 rounded-lg"
            >
              <AccordionTrigger className="text-foreground text-left text-lg font-medium hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
