/**
 * MembersDashboard — Alpine Silence members homepage
 *
 * Visual-first editorial layout:
 * - "Welcome back" hero with member's first name
 * - Upcoming journeys (from bookings table)
 * - Personalized curations (editorial grid from packages data)
 * - Concierge CTA
 */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { ArrowRight, MapPin, Calendar, MessageCircle, Mail, X } from "lucide-react";
import { packages } from "@/data/packages";
import { BookingCalendar } from "@/components/BookingCalendar";
import { toast } from "sonner";

interface Member {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string | null;
  membership_tier: string;
  membership_status: string;
  joined_at: string;
  bio: string;
  preferences: string;
}

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

export default function MembersDashboard() {
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingState, setBookingState] = useState({ isOpen: false, sanctuary: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: memberData, error } = await supabase.rpc("get_member_profile");
      if (error && import.meta.env.DEV) console.error("[Dashboard] Profile RPC error:", error.message);
      if (!memberData) { navigate("/login"); return; }

      const m = memberData as Record<string, any>;
      setMember({
        id: m.id || "",
        full_name: m.full_name || "",
        email: m.email || user?.email || "",
        avatar_url: m.avatar_url || user?.user_metadata?.avatar_url || null,
        membership_tier: m.membership_tier || "founding",
        membership_status: m.membership_status || "active",
        joined_at: m.joined_at || new Date().toISOString(),
        bio: m.bio || "",
        preferences: m.preferences || "",
      });

      const { data: bookingData, error: bookErr } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (bookErr && import.meta.env.DEV) console.error("[Dashboard] Bookings error:", bookErr.message);
      if (bookingData) setBookings(bookingData as Booking[]);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[Dashboard] Failed to load:", err);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) { toast.error("Failed to cancel."); return; }
    toast.success("Booking cancelled.");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)));
  };

  if (isLoading) {
    return (
      <MembersLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-white/30 text-sm tracking-widest uppercase">Loading...</p>
        </div>
      </MembersLayout>
    );
  }

  if (!member) return null;

  const firstName = member.full_name?.split(" ")[0] || "there";
  const now = new Date();

  const upcoming = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      b.status !== "completed" &&
      (b.check_in ? new Date(b.check_in) >= now : b.preferred_date ? new Date(b.preferred_date) >= now : true)
  );

  const past = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "cancelled" ||
      (b.check_in && new Date(b.check_in) < now) ||
      (!b.check_in && b.preferred_date && new Date(b.preferred_date) < now)
  );

  // Next confirmed journey for countdown
  const nextJourney = upcoming
    .filter((b) => b.status === "confirmed")
    .sort((a, b) => {
      const dateA = a.check_in || a.preferred_date || "";
      const dateB = b.check_in || b.preferred_date || "";
      return dateA.localeCompare(dateB);
    })[0];
  const daysUntilNext = nextJourney
    ? Math.ceil(
        ((nextJourney.check_in ? new Date(nextJourney.check_in) : new Date(nextJourney.preferred_date!)).getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : null;

  // Personalized curations: score packages by keyword matches against preferences
  const curations = (() => {
    const prefs = (member.preferences + " " + member.bio).toLowerCase();
    if (!prefs.trim()) return packages.slice(0, 3);

    const stopwords = new Set([
      "the", "and", "for", "that", "this", "with", "from", "have", "been",
      "will", "would", "could", "should", "about", "into", "just", "like",
      "some", "also", "very", "much", "more", "most", "than", "then",
      "when", "what", "where", "which", "while", "your", "they", "their",
      "there", "here", "want", "need", "love", "really", "enjoy",
    ]);

    const keywords = prefs
      .split(/[\s,;.]+/)
      .filter((w) => w.length > 3 && !stopwords.has(w));

    if (keywords.length === 0) return packages.slice(0, 3);

    const scored = packages.map((pkg) => {
      const text = (pkg.name + " " + pkg.tagline + " " + pkg.description).toLowerCase();
      const score = keywords.reduce((n, kw) => {
        const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i");
        return n + (re.test(text) ? 1 : 0);
      }, 0);
      return { pkg, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3).map((s) => s.pkg);
  })();

  // First future event-tied package for seasonal nudge in empty state
  const nearestEvent = packages.find((p) => {
    if (!p.eventBadge) return false;
    if (!p.eventDates) return true; // No dates = assume future
    // Parse end date from formats like "3–4 Apr 2026", "27 Mar – 10 May 2026"
    const match = p.eventDates.match(/(\d{1,2})\s+(\w+)\s+(\d{4})$/);
    if (!match) return true;
    const end = new Date(`${match[1]} ${match[2]} ${match[3]}`);
    return end >= now;
  });

  // Profile completion check
  const profileIncomplete = !member.bio || !member.preferences;

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  // Seasonal hero image + subtitle
  const month = now.getMonth(); // 0-indexed
  const season = month >= 3 && month <= 5
    ? { image: "/images/caueh-vidal-spring.jpg", subtitle: "Spring has arrived in the Alps. Wildflowers, open trails, and longer days." }
    : month >= 6 && month <= 8
    ? { image: "/images/oeschinen-lake.jpg", subtitle: "Alpine summer at its purest. Lake swims, high passes, and golden light." }
    : month >= 9 && month <= 10
    ? { image: "/images/mountain-sunset.jpg", subtitle: "Golden larches and amber vineyards. The Alps at their most contemplative." }
    : { image: "/images/villars-winter-aerial.jpg", subtitle: "Snow-covered silence. The mountains are waiting." };

  return (
    <MembersLayout>
      <SEO title="Dashboard | Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-5xl">
        {/* ── Hero greeting with seasonal image ── */}
        <section className="mb-20">
          <div className="relative overflow-hidden bg-[#1B1B1B] -mx-6 sm:-mx-10 lg:-mx-16 mb-10">
            <div className="aspect-[21/9] sm:aspect-[3/1]">
              <img
                src={season.image}
                alt="Seasonal alpine landscape"
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/60 to-transparent" />
            </div>
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 lg:left-16">
              <h1 className="font-[Newsreader,serif] text-4xl sm:text-5xl lg:text-6xl text-white font-light leading-[1.1] mb-3">
                {greeting},
                <br />
                <em className="italic">{firstName}</em>.
              </h1>
              <p className="text-white/40 text-sm max-w-md leading-relaxed font-[Manrope,sans-serif]">
                {season.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* ── Profile completion prompt ── */}
        {profileIncomplete && (
          <section className="mb-12">
            <div className="bg-[#1B1B1B] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-[Newsreader,serif] text-lg text-white mb-1">
                  Complete your aesthetic profile
                </h3>
                <p className="text-white/40 text-sm leading-relaxed max-w-md">
                  {!member.bio && !member.preferences
                    ? "Tell us how you travel and what you enjoy — we'll curate experiences around your preferences."
                    : !member.preferences
                    ? "Add your preferences so we can personalise your curations."
                    : "Tell us a bit about yourself to fine-tune your experience."}
                </p>
              </div>
              <Link
                to="/members/profile"
                className="inline-flex items-center gap-3 border border-[#2A2A2A] text-white/60 px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:text-white hover:border-[#474747] transition-colors shrink-0"
              >
                Complete profile
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        )}

        {/* ── Journey countdown ── */}
        {nextJourney && daysUntilNext !== null && daysUntilNext > 0 && (
          <section className="mb-12">
            <div className="bg-[#1B1B1B] p-6 sm:p-8 flex items-center gap-6">
              <div className="shrink-0 text-center">
                <span className="font-[Newsreader,serif] text-4xl sm:text-5xl text-white font-light block leading-none">
                  {daysUntilNext}
                </span>
                <span className="text-xs tracking-[0.3em] uppercase text-white/30 font-[Manrope,sans-serif] mt-1 block">
                  {daysUntilNext === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="border-l border-[#2A2A2A] pl-6 min-w-0">
                <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-1 font-[Manrope,sans-serif]">
                  Your next journey
                </p>
                <p className="text-white font-[Newsreader,serif] text-lg truncate">
                  {bookingLabels[nextJourney.sanctuary_id || nextJourney.experience_type || ""] || "Journey"}
                </p>
                <p className="text-white/30 text-xs mt-0.5 flex items-center gap-1.5">
                  <Calendar size={11} />
                  {nextJourney.check_in
                    ? new Date(nextJourney.check_in).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
                    : nextJourney.preferred_date
                    ? new Date(nextJourney.preferred_date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })
                    : ""}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ── Upcoming Journeys ── */}
        <section className="mb-20">
          <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-8">
            Upcoming Journeys
          </h2>

          {upcoming.length === 0 ? (
            <div className="bg-[#1B1B1B] p-8 sm:p-12">
              <div className="max-w-md">
                <h3 className="font-[Newsreader,serif] text-xl text-white mb-3">
                  No journeys planned yet.
                </h3>
                <p className="text-white/40 text-sm mb-6 leading-relaxed">
                  Your first alpine escape is one message away. We'll design something around your schedule.
                </p>
                {nearestEvent && (
                  <Link
                    to="/members/explore"
                    className="flex items-center gap-4 bg-[#131313] border border-[#2A2A2A] p-4 mb-6 hover:border-[#474747] transition-colors group"
                  >
                    <img
                      src={nearestEvent.image}
                      alt={nearestEvent.name}
                      className="w-16 h-12 object-cover shrink-0"
                      style={nearestEvent.imagePosition ? { objectPosition: nearestEvent.imagePosition } : undefined}
                    />
                    <div className="min-w-0">
                      <p className="text-xs tracking-[0.2em] uppercase text-white/30 mb-0.5 font-[Manrope,sans-serif]">
                        Coming up — {nearestEvent.eventDates || nearestEvent.availability}
                      </p>
                      <p className="text-white text-sm font-[Newsreader,serif] truncate">{nearestEvent.name}</p>
                      <p className="text-white/30 text-xs">{nearestEvent.price}</p>
                    </div>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0 ml-auto" />
                  </Link>
                )}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.slice(0, 4).map((b) => {
                const key = b.sanctuary_id || b.experience_type || "";
                const label = bookingLabels[key] || key || "Journey";
                const image = bookingImages[key] || "/images/mountain-sunset.jpg";
                const dateStr = b.check_in
                  ? `${new Date(b.check_in).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}${b.check_out ? ` — ${new Date(b.check_out).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}` : ""}`
                  : b.preferred_date
                  ? new Date(b.preferred_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                  : "";
                const canCancel =
                  (b.status === "inquiry" || b.status === "confirmed") &&
                  (b.check_in ? new Date(b.check_in) > new Date(Date.now() + 7 * 86400000) : true);

                return (
                  <div key={b.id} className="group relative overflow-hidden bg-[#1B1B1B]">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={image}
                        alt={label}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span
                        className={`inline-block text-xs uppercase tracking-[0.2em] px-3 py-1 mb-3 ${statusStyles[b.status] || "bg-white/5 text-white/30"}`}
                      >
                        {b.status}
                      </span>
                      <h3 className="font-[Newsreader,serif] text-xl text-white mb-1">{label}</h3>
                      {dateStr && (
                        <p className="text-white/40 text-xs flex items-center gap-1.5">
                          <Calendar size={12} />
                          {dateStr}
                        </p>
                      )}
                    </div>
                    {canCancel && (
                      <button
                        onClick={() => cancelBooking(b.id)}
                        className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors"
                        title="Cancel booking"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Personalized Curations ── */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-[Newsreader,serif] text-2xl text-white font-light">
              Personalized Curations
            </h2>
            <Link
              to="/members/explore"
              className="text-xs tracking-[0.3em] uppercase text-white/30 hover:text-white transition-colors font-[Manrope,sans-serif] hidden sm:block"
            >
              Explore all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {curations.map((pkg) => (
              <Link
                key={pkg.id}
                to="/members/explore"
                className="group bg-[#1B1B1B] overflow-hidden hover:bg-[#1F1F1F] transition-colors duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    style={pkg.imagePosition ? { objectPosition: pkg.imagePosition } : undefined}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-2">{pkg.duration}</p>
                  <h3 className="font-[Newsreader,serif] text-lg text-white mb-2">{pkg.name}</h3>
                  <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{pkg.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Editorial quote ── */}
        <section className="mb-20 py-16 sm:py-20">
          <blockquote className="max-w-2xl">
            <p className="font-[Newsreader,serif] text-2xl sm:text-3xl text-white/80 italic leading-relaxed">
              "True luxury is the courage to remain silent in a world that never stops talking."
            </p>
            <footer className="mt-6 text-xs tracking-[0.3em] uppercase text-white/30">
              — The Silent Curator
            </footer>
          </blockquote>
        </section>

        {/* ── Past Journeys ── */}
        {past.length > 0 && (
          <section className="mb-20">
            <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-8">
              Past Journeys
            </h2>
            <div className="space-y-2">
              {past.slice(0, 5).map((b) => {
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
                    <div className="flex items-center gap-4">
                      <MapPin size={14} className="text-white/20" />
                      <span className="text-white/60 text-sm">{label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white/20 text-xs">{dateStr}</span>
                      <span
                        className={`text-xs uppercase tracking-[0.15em] px-2 py-0.5 ${statusStyles[b.status] || "text-white/30"}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Need something else? ── */}
        <section className="mb-20 bg-[#1B1B1B] p-8 sm:p-12">
          <h2 className="font-[Newsreader,serif] text-2xl text-white mb-3">
            Need something else?
          </h2>
          <p className="text-white/40 text-sm max-w-md mb-8 leading-relaxed">
            Tell us when you want to escape and how many people. No forms, no back-and-forth. Just a conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/41787002202?text=Hi%2C%20I'd%20like%20to%20inquire%20about%20availability."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-white text-[#131313] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-white/90 transition-colors"
            >
              <MessageCircle size={14} />
              WhatsApp
            </a>
            <a
              href="mailto:hello@swissperiences.ch?subject=Booking Inquiry"
              className="inline-flex items-center justify-center gap-3 border border-[#2A2A2A] text-white/60 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:text-white hover:border-[#474747] transition-colors"
            >
              <Mail size={14} />
              Email
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="py-8 border-t border-[#1F1F1F]">
          <div className="flex items-center justify-between">
            <span className="font-[Newsreader,serif] text-sm text-white/20">
              Swissperiences
            </span>
            <span className="text-xs text-white/15 tracking-[0.2em] uppercase">
              Est. 2024
            </span>
          </div>
        </footer>
      </div>

      <BookingCalendar
        sanctuaryName={bookingState.sanctuary}
        isOpen={bookingState.isOpen}
        onClose={() => setBookingState({ ...bookingState, isOpen: false })}
      />
    </MembersLayout>
  );
}
