import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];

export default function FAQ() {
  const { t } = useTranslation('home');
  return (
    <section className="relative py-24 px-6" aria-labelledby="faq-title">
      {/* Overlay for FAQ section */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-white/60 text-center mb-12">
          {t('faq.heading')}
        </p>

        <Accordion type="single" collapsible className="w-full">
          {faqKeys.map((faqKey, index) => (
            <AccordionItem
              key={faqKey}
              value={`item-${index}`}
              className="border-white/20 hover:bg-white/10 transition-colors duration-200 px-4 rounded-lg"
            >
              <AccordionTrigger className="text-white text-left text-lg font-medium hover:no-underline py-6">
                {t(`faq.${faqKey}.question`)}
              </AccordionTrigger>
              <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                {t(`faq.${faqKey}.answer`)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
