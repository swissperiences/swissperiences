import { Link } from "react-router-dom";
import {
  Car, Flower2, Utensils, Camera, Mountain, Castle, Sandwich,
  MapPin, Train, Wine, Snowflake, Sun, Leaf, TreePine, Coffee,
  Music, Bike, Ship, Tent, Heart, Star, Compass, type LucideIcon,
} from "lucide-react";
import type { DiscoveryPack, DiscoverySeason } from "@/types/discovery";

/** Map of supported lucide icon slugs → components. Add new icons here as needed. */
const iconMap: Record<string, LucideIcon> = {
  car: Car, "flower-2": Flower2, utensils: Utensils, camera: Camera,
  mountain: Mountain, castle: Castle, sandwich: Sandwich, "map-pin": MapPin,
  train: Train, wine: Wine, snowflake: Snowflake, sun: Sun, leaf: Leaf,
  "tree-pine": TreePine, coffee: Coffee, music: Music, bike: Bike,
  ship: Ship, tent: Tent, heart: Heart, star: Star, compass: Compass,
};

const seasonStyles: Record<DiscoverySeason, { label: string; classes: string }> = {
  spring:  { label: "Primavera", classes: "text-emerald-300/70 bg-emerald-900/30 border-emerald-500/20" },
  summer:  { label: "Verão",     classes: "text-amber-300/70 bg-amber-900/30 border-amber-500/20" },
  autumn:  { label: "Outono",    classes: "text-orange-300/70 bg-orange-900/30 border-orange-500/20" },
  winter:  { label: "Inverno",   classes: "text-sky-300/70 bg-sky-900/30 border-sky-500/20" },
};

/** Parse Postgres daterange "[2025-03-27,2025-05-11]" into formatted string */
function formatDateRange(daterange: string | null): string | null {
  if (!daterange) return null;
  const match = daterange.match(/[\[(](\d{4}-\d{2}-\d{2}),\s*(\d{4}-\d{2}-\d{2})[\])]/);
  if (!match) return null;
  const fmt = (iso: string) => {
    const d = new Date(iso + "T00:00:00");
    const day = d.getDate();
    const month = d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");
    return `${day} ${month}`;
  };
  return `${fmt(match[1])} — ${fmt(match[2])}`;
}

/** Resolve a lucide icon slug to a component from the static map */
function getLucideIcon(slug: string): LucideIcon | null {
  return iconMap[slug] ?? null;
}

interface DiscoveryPackCardProps {
  pack: DiscoveryPack;
}

export default function DiscoveryPackCard({ pack }: DiscoveryPackCardProps) {
  const season = seasonStyles[pack.season];
  const dateRange = formatDateRange(pack.event_dates);
  const includes = pack.discovery_pack_includes ?? [];

  return (
    <div className="group relative bg-[#0a0a0a] border border-white/5 overflow-hidden hover:border-glacier-500/20 transition-colors duration-500">
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {pack.cover_image_url ? (
          <img
            src={pack.cover_image_url}
            alt={pack.title_en}
            className="w-full h-full object-cover brightness-[0.5] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-700"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        {/* Season badge + duration */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className={`text-xs uppercase tracking-[0.2em] backdrop-blur-sm px-3 py-1 border ${season.classes}`}>
            {season.label}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-white/40 bg-black/40 backdrop-blur-sm px-3 py-1 border border-white/10">
            {pack.duration_days === 1 ? "1 dia" : `${pack.duration_days} dias`}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8">
        <h3 className="font-serif text-xl md:text-2xl text-white/85 mb-1">
          {pack.title_pt}
        </h3>
        <p className="text-white/40 text-sm font-light italic mb-1">
          {pack.title_en}
        </p>
        {pack.highlight_event && (
          <p className="text-glacier-400/60 text-xs mb-6">
            {pack.highlight_event}
          </p>
        )}

        {/* Includes */}
        {includes.length > 0 && (
          <div className="space-y-2 mb-8">
            {includes
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => {
                const Icon = getLucideIcon(item.icon_name);
                return (
                  <div key={item.id} className="flex items-start gap-2.5">
                    {Icon ? (
                      <Icon size={14} className="mt-0.5 text-white/25 shrink-0" />
                    ) : (
                      <span className="w-1 h-1 mt-2 bg-white/20 rounded-full shrink-0" />
                    )}
                    <span className="text-white/50 text-sm">{item.label_pt}</span>
                  </div>
                );
              })}
          </div>
        )}

        {/* Price + dates + CTA */}
        <div className="flex items-end justify-between gap-4 pt-4 border-t border-white/5">
          <div>
            <span className="text-white/70 text-lg font-serif">
              CHF {pack.price_chf.toLocaleString("de-CH")}
            </span>
            {dateRange && (
              <span className="text-white/40 text-xs block mt-1">
                {dateRange}
              </span>
            )}
            <span className="text-white/30 text-xs block mt-0.5">
              {pack.max_guests <= 2
                ? `até ${pack.max_guests} pessoas`
                : `até ${pack.max_guests} pessoas`}
            </span>
          </div>
          <Link
            to={`/discovery/${pack.slug}`}
            className="text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors border-b border-white/20 hover:border-glacier-500/40 pb-0.5"
          >
            Ver detalhes
          </Link>
        </div>
      </div>
    </div>
  );
}
