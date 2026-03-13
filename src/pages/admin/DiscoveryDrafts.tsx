import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { DiscoveryPack } from "@/types/discovery";

export default function DiscoveryDrafts() {
  const [drafts, setDrafts] = useState<DiscoveryPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchDrafts() {
    // TODO: replace table name cast after types are generated
    const { data, error } = await supabase
      .from("discovery_packs" as string)
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDrafts(data as unknown as DiscoveryPack[]);
    }
    setLoading(false);
  }

  useEffect(() => { fetchDrafts(); }, []);

  async function updateStatus(id: string, status: "active" | "archived") {
    setUpdating(id);
    const { error } = await supabase
      .from("discovery_packs" as string)
      .update({ status })
      .eq("id", id);

    if (!error) {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    }
    setUpdating(null);
  }

  /** Parse Postgres daterange to readable string */
  function formatDateRange(daterange: string | null): string {
    if (!daterange) return "—";
    const match = daterange.match(/[\[(](\d{4}-\d{2}-\d{2}),\s*(\d{4}-\d{2}-\d{2})[\])]/);
    if (!match) return daterange;
    return `${match[1]} → ${match[2]}`;
  }

  return (
    <div className="min-h-screen bg-[#060606] text-white">
      <Navigation />

      <section className="pt-32 pb-16 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-3xl md:text-4xl text-white/90 mb-2">
            Discovery Drafts
          </h1>
          <p className="text-white/40 text-sm mb-10">
            Packs criados pelo agente, aguardando revisão.
          </p>

          {loading ? (
            <p className="text-white/40 text-sm">Carregando...</p>
          ) : drafts.length === 0 ? (
            <p className="text-white/40 text-sm">Nenhum draft pendente.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 text-left">
                    <th className="py-3 pr-4 font-medium">Título</th>
                    <th className="py-3 pr-4 font-medium">Evento</th>
                    <th className="py-3 pr-4 font-medium">Datas</th>
                    <th className="py-3 pr-4 font-medium">Preço</th>
                    <th className="py-3 pr-4 font-medium">Criado em</th>
                    <th className="py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.map((draft) => (
                    <tr key={draft.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-4 pr-4">
                        <span className="text-white/80">{draft.title_pt}</span>
                        <span className="text-white/30 text-xs block">{draft.title_en}</span>
                      </td>
                      <td className="py-4 pr-4 text-white/50">
                        {draft.highlight_event || "—"}
                      </td>
                      <td className="py-4 pr-4 text-white/50 whitespace-nowrap">
                        {formatDateRange(draft.event_dates)}
                      </td>
                      <td className="py-4 pr-4 text-white/60 whitespace-nowrap">
                        CHF {draft.price_chf}
                      </td>
                      <td className="py-4 pr-4 text-white/40 whitespace-nowrap">
                        {new Date(draft.created_at).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateStatus(draft.id, "active")}
                            disabled={updating === draft.id}
                            className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border border-emerald-500/30 text-emerald-300/70 hover:bg-emerald-900/30 transition-colors disabled:opacity-50"
                          >
                            {updating === draft.id ? "..." : "Ativar"}
                          </button>
                          <button
                            onClick={() => updateStatus(draft.id, "archived")}
                            disabled={updating === draft.id}
                            className="text-[10px] uppercase tracking-[0.15em] px-3 py-1.5 border border-white/10 text-white/40 hover:bg-white/5 transition-colors disabled:opacity-50"
                          >
                            Descartar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
