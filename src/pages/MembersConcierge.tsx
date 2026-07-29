/**
 * MembersConcierge — the concierge surface inside My Swissperiences.
 *
 * For a founder-hosted brand the concierge *is* the product, so it gets its
 * own page. Everything here is real today: the WhatsApp deep link and email
 * both reach the host directly; the templates are just prefilled messages.
 * No fake chat, no invented message history.
 */
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { MessageCircle, Mail } from "lucide-react";

const WHATSAPP = "https://wa.me/41787002202";

const templates = [
  {
    label: "Plan dates",
    text: "Hi! I'd like to look at dates for my next stay.",
  },
  {
    label: "Add an experience",
    text: "Hi! I'd like to add an experience to my stay.",
  },
  {
    label: "Arrival & transfer",
    text: "Hi! Could we talk about my arrival and a transfer from Geneva?",
  },
  {
    label: "Something else",
    text: "Hi! I have a question.",
  },
];

export default function MembersConcierge() {
  return (
    <MembersLayout>
      <SEO title="Concierge | My Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-3xl">
        <header className="mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 font-[Manrope,sans-serif]">
            My Swissperiences
          </p>
          <h1 className="font-[Newsreader,serif] text-4xl sm:text-5xl text-white font-light mb-4">
            Concierge
          </h1>
          <p className="text-white/40 text-sm leading-relaxed max-w-md">
            No forms, no ticket numbers. You write to your host, and your host
            answers — personally, within 48 hours, usually much sooner.
          </p>
        </header>

        {/* ── Direct lines ── */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`${WHATSAPP}?text=${encodeURIComponent("Hi! I'd like to talk about my stay.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-[#131313] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/90 transition-colors"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
            <a
              href="mailto:hello@swissperiences.ch?subject=Concierge"
              className="inline-flex items-center justify-center gap-3 border border-[#2A2A2A] text-white/60 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:text-white hover:border-[#474747] transition-colors"
            >
              <Mail size={14} />
              Email
            </a>
          </div>
        </section>

        {/* ── Start from a template ── */}
        <section className="mb-16">
          <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-2">
            Start with a message
          </h2>
          <p className="text-white/30 text-sm mb-8">
            One tap opens WhatsApp with the message ready — edit it, send it, done.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templates.map((template) => (
              <a
                key={template.label}
                href={`${WHATSAPP}?text=${encodeURIComponent(template.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1B1B1B] p-6 hover:bg-[#1F1F1F] transition-colors group"
              >
                <p className="text-white text-sm font-[Newsreader,serif] mb-2 group-hover:text-white transition-colors">
                  {template.label}
                </p>
                <p className="text-white/30 text-xs leading-relaxed">"{template.text}"</p>
              </a>
            ))}
          </div>
        </section>

        {/* ── What the concierge covers ── */}
        <section className="bg-[#1B1B1B] p-6 sm:p-8">
          <h3 className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">
            What your host arranges
          </h3>
          <ul className="space-y-2.5 text-white/50 text-sm font-light">
            <li>Dates, extensions and changes to a stay</li>
            <li>Transfers — including airport pickup in Geneva</li>
            <li>Experiences, dining and additions to your journey</li>
            <li>Anything you'd rather not organise yourself</li>
          </ul>
        </section>
      </div>
    </MembersLayout>
  );
}
