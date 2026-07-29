/**
 * MembersProfileNew — Alpine Silence member profile
 *
 * "Elite Member" card + aesthetic preferences form.
 * Uses own RPC call (useMemberProfile can't work here — provider is inside MembersLayout JSX).
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import { Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  full_name: string;
  email: string;
  avatar_url: string | null;
  city: string;
  country: string;
  phone: string;
  bio: string;
  preferences: string;
  membership_tier: string;
  membership_status: string;
  joined_at: string;
}

export default function MembersProfileNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { data: memberData, error } = await supabase.rpc("get_member_profile");
      if (error && import.meta.env.DEV) console.error("[Profile] RPC error:", error.message);
      if (!memberData) { navigate("/login"); return; }

      const m = memberData as Record<string, any>;
      const p: ProfileData = {
        full_name: m.full_name || "",
        email: m.email || user?.email || "",
        avatar_url: m.avatar_url || user?.user_metadata?.avatar_url || null,
        city: m.city || "",
        country: m.country || "",
        phone: m.phone || "",
        bio: m.bio || "",
        preferences: m.preferences || "",
        membership_tier: m.membership_tier || "founding",
        membership_status: m.membership_status || "active",
        joined_at: m.joined_at || new Date().toISOString(),
      };
      setProfile(p);
      setFullName(p.full_name);
      setCity(p.city);
      setCountry(p.country);
      setPhone(p.phone);
      setBio(p.bio);
      setPreferences(p.preferences);
    } catch (err) {
      if (import.meta.env.DEV) console.error("[Profile] Failed to load:", err);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = () => {
    if (!profile) return false;
    return (
      fullName !== profile.full_name ||
      city !== profile.city ||
      country !== profile.country ||
      phone !== profile.phone ||
      bio !== profile.bio ||
      preferences !== profile.preferences
    );
  };

  const handleSave = async () => {
    if (!hasChanges()) return;
    if (!fullName.trim()) { toast.error("Name is required."); return; }

    setIsSaving(true);
    try {
      const { data, error } = await supabase.rpc("update_member_profile", {
        p_full_name: fullName.trim(),
        p_city: city.trim() || null,
        p_country: country.trim() || null,
        p_phone: phone.trim() || null,
        p_bio: bio.trim() || null,
        p_preferences: preferences.trim() || null,
      });
      if (error) throw error;
      const result = data as Record<string, any>;
      if (result?.error) { toast.error(result.error); return; }

      toast.success("Profile updated.");
      // Refresh profile data
      await loadProfile();
    } catch (err) {
      if (import.meta.env.DEV) console.error("[Profile] Failed to update:", err);
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
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

  if (!profile) return null;

  const tierLabel =
    profile.membership_tier === "member"
      ? "Member"
      : `${profile.membership_tier.charAt(0).toUpperCase()}${profile.membership_tier.slice(1)} Member`;

  return (
    <MembersLayout>
      <SEO title="Profile | Swissperiences" />

      <div className="px-6 sm:px-10 lg:px-16 py-12 lg:py-20 max-w-3xl">
        {/* ── Elite Member header ── */}
        <section className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs tracking-[0.4em] uppercase text-white/30 mb-4 font-[Manrope,sans-serif]">
                Member Profile
              </p>
              <h1 className="font-[Newsreader,serif] text-4xl sm:text-5xl text-white italic font-light">
                {tierLabel}
              </h1>
            </div>
            <p className="font-[Newsreader,serif] text-white/20 text-lg">
              Since {new Date(profile.joined_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          </div>

          {/* Member identity card */}
          <div className="bg-[#1B1B1B] p-6 sm:p-8 flex items-center gap-5">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.full_name} className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center text-white/60 text-xl font-[Newsreader,serif]">
                {profile.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-white text-lg font-[Newsreader,serif]">{profile.full_name}</h2>
              <p className="text-white/30 text-xs mt-1">{profile.email}</p>
              {(profile.city || profile.country) && (
                <p className="text-white/20 text-xs mt-0.5">
                  {[profile.city, profile.country].filter(Boolean).join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ── Aesthetic Profile ── */}
        <section className="mb-16">
          <h2 className="font-[Newsreader,serif] text-2xl text-white font-light mb-2">
            Aesthetic Profile
          </h2>
          <p className="text-white/30 text-sm mb-8">
            Fine-tune your sensory journey. We curate environments around your temperamental preferences.
          </p>

          <div className="space-y-8">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors placeholder:text-white/15 font-[Manrope,sans-serif]"
                placeholder="Your full name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors placeholder:text-white/15 font-[Manrope,sans-serif]"
                  placeholder="e.g. Geneva"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors placeholder:text-white/15 font-[Manrope,sans-serif]"
                  placeholder="e.g. Switzerland"
                />
              </div>
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                Phone <span className="normal-case tracking-normal text-white/15">(for stay logistics only)</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors placeholder:text-white/15 font-[Manrope,sans-serif]"
                placeholder="+41 78 700 22 02"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                About You
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors resize-none placeholder:text-white/15 font-[Manrope,sans-serif]"
                placeholder="Tell us how you like to travel, relax and disconnect..."
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/30 block mb-3 font-[Manrope,sans-serif]">
                Preferences
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
                className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white/60 text-white px-0 py-3 text-sm outline-none transition-colors resize-none placeholder:text-white/15 font-[Manrope,sans-serif]"
                placeholder="Dietary needs, preferred activities, energy levels, anything that helps us personalise your stay..."
              />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[#1F1F1F]">
            <button
              onClick={handleSave}
              disabled={!hasChanges() || isSaving}
              className={`inline-flex items-center gap-2 px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium transition-all ${
                hasChanges() && !isSaving
                  ? "bg-white text-[#131313] hover:bg-white/90 cursor-pointer"
                  : "bg-[#1F1F1F] text-white/20 cursor-not-allowed"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </section>

        {/* ── Membership info ── */}
        <section className="mb-16 bg-[#1B1B1B] p-6 sm:p-8">
          <h3 className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">Membership</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-white/20 text-xs uppercase tracking-widest mb-1">Tier</p>
              <p className="text-white text-sm">{tierLabel}</p>
            </div>
            <div>
              <p className="text-white/20 text-xs uppercase tracking-widest mb-1">Status</p>
              <p className="text-emerald-400 text-sm capitalize">{profile.membership_status}</p>
            </div>
            <div>
              <p className="text-white/20 text-xs uppercase tracking-widest mb-1">Contact</p>
              <p className="text-white/40 text-sm">hello@swissperiences.ch</p>
            </div>
          </div>
        </section>
      </div>
    </MembersLayout>
  );
}
