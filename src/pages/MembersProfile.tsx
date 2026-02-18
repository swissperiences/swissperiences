import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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

const MembersProfile = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    // Form state
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
            const { data: memberData } = await supabase.rpc("get_member_profile");
            if (!memberData) {
                navigate("/login");
                return;
            }

            const m = memberData as Record<string, any>;
            const p: ProfileData = {
                full_name: m.full_name || "",
                email: m.email || "",
                avatar_url: m.avatar_url || null,
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

            // Prefill form
            setFullName(p.full_name);
            setCity(p.city);
            setCountry(p.country);
            setPhone(p.phone);
            setBio(p.bio);
            setPreferences(p.preferences);
        } catch (error) {
            console.error("Error loading profile:", error);
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
        if (!fullName.trim()) {
            toast.error("Name is required.");
            return;
        }

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
            if (result?.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Profile updated — we'll use this to fine-tune your next escape.");
            // Update local profile state so hasChanges() resets
            setProfile((prev) =>
                prev
                    ? {
                          ...prev,
                          full_name: fullName.trim(),
                          city: city.trim(),
                          country: country.trim(),
                          phone: phone.trim(),
                          bio: bio.trim(),
                          preferences: preferences.trim(),
                      }
                    : prev
            );
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (hasChanges()) {
            // Reset form to original values
            if (profile) {
                setFullName(profile.full_name);
                setCity(profile.city);
                setCountry(profile.country);
                setPhone(profile.phone);
                setBio(profile.bio);
                setPreferences(profile.preferences);
            }
        }
        navigate("/members");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/60 text-sm">Loading...</div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-black">
            <SEO title="Edit Profile | Swissperiences" />
            <Navigation />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-20">
                {/* Back link */}
                <Link
                    to="/members"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white text-xs uppercase tracking-widest mb-10 transition-colors"
                >
                    <ArrowLeft size={14} />
                    Member Area
                </Link>

                {/* Header */}
                <div className="mb-12">
                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                        Profile
                    </span>
                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-3">
                        Edit your profile
                    </h1>
                    <p className="text-white/40 text-sm mb-2">
                        We use this to tailor your stays, hosts and experiences to you.
                    </p>
                    <p className="text-white/30 text-xs">
                        Member since{" "}
                        {new Date(profile.joined_at).toLocaleDateString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}
                        {" "}
                        <span className="text-white/20">&middot;</span>{" "}
                        <span className="text-emerald-400/60">{profile.membership_tier}</span>
                    </p>
                </div>

                {/* Avatar + Email (read-only) */}
                <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/5">
                    {profile.avatar_url ? (
                        <img
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            className="w-14 h-14 rounded-full"
                        />
                    ) : (
                        <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-lg">
                            {profile.full_name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <p className="text-white text-sm">{profile.email}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                            Email cannot be changed here
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-8">
                    {/* Full Name */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* City + Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                placeholder="e.g. Geneva"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                                Country
                            </label>
                            <input
                                type="text"
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                                placeholder="e.g. Switzerland"
                            />
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                            Phone <span className="normal-case tracking-normal text-white/20">(for stay logistics only)</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
                            placeholder="+41 78 700 22 02"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                            About You
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none placeholder:text-white/20"
                            placeholder="Tell us how you like to travel, relax and disconnect..."
                        />
                    </div>

                    {/* Preferences */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                            Preferences
                        </label>
                        <textarea
                            value={preferences}
                            onChange={(e) => setPreferences(e.target.value)}
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors resize-none placeholder:text-white/20"
                            placeholder="Dietary needs, preferred activities, energy levels, anything that helps us personalise your stay..."
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-12 pt-8 border-t border-white/5">
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges() || isSaving}
                        className={`inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-medium transition-all
                            ${
                                hasChanges() && !isSaving
                                    ? "bg-white text-black hover:bg-white/90 cursor-pointer"
                                    : "bg-white/10 text-white/30 cursor-not-allowed"
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
                                Save Changes
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-8 py-3.5 text-xs uppercase tracking-widest text-white/40 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MembersProfile;
