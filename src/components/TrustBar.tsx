import { Fragment } from "react";

const trustItems = [
  "Villars-sur-Ollon, 1,300m",
  "Every stay personally curated",
  "Founder-hosted",
  "Since 2023",
];

export default function TrustBar() {
  return (
    <section className="py-5 px-8 md:px-16 bg-[#060606] border-y border-white/5">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        {trustItems.map((item, i) => (
          <Fragment key={i}>
            {i > 0 && <span className="hidden md:block w-px h-3 bg-white/10" />}
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
              {item}
            </span>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
