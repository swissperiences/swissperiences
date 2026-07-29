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
      <div className="max-w-5xl mx-auto">
        <span className="text-xs uppercase tracking-[0.4em] text-white/40 block text-center mb-20 md:mb-28">
          In Their Words
        </span>

        <div className="space-y-24 md:space-y-32">
          {journals.map((j, i) => (
            <div
              key={j.id}
              className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16`}
            >
              {/* Guest photo */}
              <Link to={`/journals/${j.slug}`} className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0 group">
                <div className="w-full h-full rounded-full overflow-hidden border border-white/10 group-hover:border-glacier-500/30 transition-colors">
                  <img
                    src={j.coverImage}
                    alt={j.guests}
                    className={`w-full h-full object-cover ${j.coverPosition || ''} group-hover:scale-[1.05] transition-transform duration-700`}
                    loading="lazy"
                  />
                </div>
              </Link>

              {/* Quote + attribution */}
              <div className={`flex-1 ${i % 2 === 0 ? 'text-center md:text-left' : 'text-center md:text-right'}`}>
                <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/60 italic leading-[1.4] mb-6">
                  "{j.quote}"
                </p>
                <div className={`flex items-center gap-3 ${i % 2 === 0 ? 'justify-center md:justify-start' : 'justify-center md:justify-end'}`}>
                  <span className="text-white/50 text-sm">{j.guests}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/40 text-sm">{j.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <Link
                    to={`/journals/${j.slug}`}
                    className="text-xs uppercase tracking-[0.2em] text-white/40 hover:text-glacier-300 transition-colors border-b border-transparent hover:border-glacier-500/30 pb-0.5"
                  >
                    Read Story
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
