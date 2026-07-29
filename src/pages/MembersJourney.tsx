/**
 * MembersJourney — "My Journey" inside My Swissperiences.
 *
 * Shows the guest's real journeys from the bookings table as a quiet timeline:
 * upcoming stays first, past stays after. Reuses the exact data access pattern
 * of MembersDashboard (RLS-scoped select on `bookings`). Honest empty state —
 * no fake itineraries, no invented features.
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { ArrowRight, Calendar, MapPin } from "lucide-react";

interface Booking {
  id: string;
  sanctuary_id: string | null;
  experience_type: string | null;
  check_in: string | null;
  check_out: string | null;
  preferred_date: string | null;
  guests: number;
  status: string;
  total_nights: number | null;
  created_at: string;
}

const bookingLabels: Record<string, string> = {
  villars: "The Villars Loft",
  road_journey: "Alps Road Journey",
  guided_hike: "Guided Alpine Hike",
  cinematic_memories: "Cinematic Memories",
  private_chef: "Private Chef",
};

const bookingImages: Record<string, string> = {
  villars: "/images/villars-hero.jpg",
  road_journey: "/images/alpine-road-villars.jpg",
  guided_hike: "/images/host-hiking.jpg",
  cinematic_memories: "/images/drone/lake-brienz-aerial.jpg",
  private_chef: "/images/loft/IMG_8759.jpg",
};

const statusStyles: Record<string, string> = {
  inquiry: "bg-amber-500/15 text-amber-300",
  confirmed: "bg-emerald-500/15 text-emerald-300",
  cancelled: "bg-white/5 text-white/30",
  completed: "bg-white/5 text-white/30",
};

function formatRange(b: Booking): string {
  if (b.check_in) {
    const from = new Date(b.check_in).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    if (b.check_out) {
      const to = new Date(b.check_out).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
      return `${from} — ${to}`;
    }
    return from;
  }
  if (b.preferred_date) {
    return new Date(b.preferred_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  return "";
}

export default function MembersJourney() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("bookings")
          .select("*")
          .order("created_at", { ascending: false });
        if (error && import.meta.env.DEV) console.error("[Journey] Bookings error:", error.message);
        if (data) setBookings(data as Booking[]);
      } catch (err) {
        if (import.meta.env.DEV) console.error("[Journey] Failed to load:", err);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [navigate]);

  if (isLoading) {
    return (
      <MembersLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white/30 text-sm tracking-widest uppercase">Loading...</p>
        </div>
      </MembersLayout>
    );
  }

  const now = new Date();
  const upcoming = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.status !== "completed" &&
      (b.check_in ? new Date(b.check_in) >= now : b.preferred_date ? new Date(b.preferred_date) >= now : true)
  );
  const past = bookings.filter((b) => !upcoming.includes(b));

  return (
    <MembersLayout>
      <SEO title="My Journey | My Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-4xl">
        <header className="mb-14">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-4 font-[Manrope,sans-serif]">
            My Swissperiences
          </p>
          <h1 className="font-[Newsreader,serif] text-4xl sm:text-5xl text-white font-light">
            My Journey
          </h1>
        </header>

        {/* ── Upcoming ── */}
        <section className="mb-20">
          <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-8">
            Upcoming
          </h2>

          {upcoming.length === 0 ? (
            <div className="bg-[#1B1B1B] p-8 sm:p-12">
              <div className="max-w-md">
                <h3 className="font-[Newsreader,serif] text-xl text-white mb-3">
                  No journey planned yet.
                </h3>
                <p className="text-white/40 text-sm mb-8 leading-relaxed">
                  When a stay is confirmed, it lives here — dates, place and what
                  your host is preparing around it. Your first one is a
                  conversation away.
                </p>
                <Link
                  to="/members/book"
                  className="inline-flex items-center gap-3 bg-white text-[#131313] px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/90 transition-colors"
                >
                  Plan a journey
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((b) => {
                const key = b.sanctuary_id || b.experience_type || "";
                const label = bookingLabels[key] || key || "Journey";
                const image = bookingImages[key] || "/images/mountain-sunset.jpg";
                return (
                  <div key={b.id} className="bg-[#1B1B1B] flex flex-col sm:flex-row overflow-hidden">
                    <div className="sm:w-56 shrink-0 aspect-[16/9] sm:aspect-auto">
                      <img src={image} alt={label} className="w-full h-full object-cover opacity-70" />
                    </div>
                    <div className="p-6 sm:p-8 flex-1 min-w-0">
                      <span
                        className={`inline-block text-[10px] uppercase tracking-[0.2em] px-3 py-1 mb-3 ${statusStyles[b.status] || "bg-white/5 text-white/30"}`}
                      >
                        {b.status}
                      </span>
                      <h3 className="font-[Newsreader,serif] text-xl text-white mb-2">{label}</h3>
                      <p className="text-white/40 text-sm flex items-center gap-2 mb-1">
                        <Calendar size={13} />
                        {formatRange(b) || "Dates being aligned with your host"}
                      </p>
                      <p className="text-white/25 text-xs mt-3 leading-relaxed">
                        Arrival details and the day-by-day plan are shared personally
                        by your host before the stay.
                      </p>
                    </div>
                  </div>
                );
              })}
              <Link
                to="/members/book"
                className="inline-flex items-center gap-3 border border-[#2A2A2A] text-white/60 px-6 py-3 mt-4 text-xs uppercase tracking-[0.2em] font-medium hover:text-white hover:border-[#474747] transition-colors"
              >
                Plan new dates
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>

        {/* ── Past ── */}
        {past.length > 0 && (
          <section className="mb-20">
            <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-8">
              Past
            </h2>
            <div className="space-y-2">
              {past.map((b) => {
                const key = b.sanctuary_id || b.experience_type || "";
                const label = bookingLabels[key] || key || "Journey";
                const dateStr = b.check_in
                  ? new Date(b.check_in).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  : b.preferred_date
                  ? new Date(b.preferred_date).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
                  : "";
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between py-4 border-b border-[#1F1F1F] last:border-0"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <MapPin size={14} className="text-white/20 shrink-0" />
                      <span className="text-white/60 text-sm truncate">{label}</span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <span className="text-white/20 text-xs">{dateStr}</span>
                      <span
                        className={`text-[10px] uppercase tracking-[0.15em] px-2 py-0.5 ${statusStyles[b.status] || "text-white/30"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-white/25 text-xs mt-8 leading-relaxed max-w-md">
              Journals and cinematic memories from past journeys are being brought
              into this page. Until then, your host keeps them safe.
            </p>
          </section>
        )}
      </div>
    </MembersLayout>
  );
}
