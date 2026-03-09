import { Link } from "react-router-dom";
import { journals } from "@/data/journals";

interface GuestQuotesProps {
  visible: boolean;
  sectionRef: React.RefObject<HTMLDivElement>;
}

export default function GuestQuotes({ visible, sectionRef }: GuestQuotesProps) {
  return (
    <section
      ref={sectionRef}
      className={`py-32 md:py-48 px-8 md:px-16 lg:px-24 bg-[#060606] transition-all duration-[1500ms] ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-4xl mx-auto">
        <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block text-center mb-16 md:mb-20">
          From Our Journals
        </span>
        <div className="space-y-20 md:space-y-28">
          {journals.map((j) => (
            <div key={j.id} className="text-center">
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/60 italic leading-[1.4] mb-6 max-w-2xl mx-auto">
                "{j.quote}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-white/50 text-sm">{j.guests}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-white/40 text-sm">{j.date}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <Link
                  to={`/journals/${j.slug}`}
                  className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors border-b border-transparent hover:border-glacier-500/30 pb-0.5"
                >
                  Read Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
