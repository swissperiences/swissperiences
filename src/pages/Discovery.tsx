import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import DiscoveryPackCard from "@/components/discovery/DiscoveryPackCard";
import { supabase } from "@/integrations/supabase/client";
import type { DiscoveryPack } from "@/types/discovery";

export default function Discovery() {
  const [packs, setPacks] = useState<DiscoveryPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPacks() {
      // TODO: replace with generated types after migration
      const { data, error } = await supabase
        .from("discovery_packs" as string)
        .select("*, discovery_pack_includes(*)")
        .eq("status", "active")
        .order("event_dates", { ascending: true });

      if (!error && data) {
        setPacks(data as unknown as DiscoveryPack[]);
      }
      setLoading(false);
    }
    fetchPacks();
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <SEO
        title="Discovery — Swissperiences"
        description="Curated seasonal experience packs in Switzerland. Fixed price, no customization needed."
        canonical="https://www.swissperiences.ch/discovery"
      />

      <Navigation />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 block mb-6">
            Discovery
          </span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-white/90 leading-[0.9] mb-6">
            Seasonal packs,<br />ready to book.
          </h1>
          <p className="text-white/50 text-base md:text-lg font-light max-w-xl">
            Experiências sazonais prontas para reservar. Preço fixo, tudo incluído — sem personalização necessária.
          </p>
        </div>
      </section>

      {/* Packs grid */}
      <section className="pb-24 md:pb-40 px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-sm">Loading...</p>
            </div>
          ) : packs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {packs.map((pack) => (
                <DiscoveryPackCard key={pack.id} pack={pack} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-white/40 text-lg font-light mb-2">
                Nenhum pack disponível no momento.
              </p>
              <p className="text-white/30 text-sm">
                Novos packs sazonais são publicados regularmente.
              </p>
              <Link
                to="/packages"
                className="inline-block mt-8 text-xs uppercase tracking-[0.25em] text-white/40 hover:text-white/70 transition-colors border-b border-white/15 hover:border-glacier-500/30 pb-1"
              >
                Ver Pacotes Curados
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
