import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import MembersLayout from "@/components/members/MembersLayout";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { useBookedDates } from "@/hooks/useBookedDates";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { Calendar, MapPin, Mountain, Car, Camera, ChefHat, ArrowLeft, Loader2, Check, Plus, X, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface MemberBasic {
    id: string;
    full_name: string;
    email: string;
}

const sanctuaries = [
    { id: "villars", name: "The Villars Loft", location: "Villars-sur-Ollon", price: "From CHF 1,200/night", nightlyRate: 1200, image: "/images/villars-hero.jpg" },
];

const experiences = [
    { id: "road_journey", name: "Alps Road Journey", icon: <Car size={18} />, price: "From CHF 850", basePrice: 850 },
    { id: "guided_hike", name: "Guided Alpine Hike", icon: <Mountain size={18} />, price: "From CHF 300", basePrice: 300 },
    { id: "cinematic_memories", name: "Cinematic Memories", icon: <Camera size={18} />, price: "From CHF 600", basePrice: 600 },
    { id: "private_chef", name: "Private Chef", icon: <ChefHat size={18} />, price: "From CHF 400", basePrice: 400 },
];

const formatCHF = (amount: number) =>
    `CHF ${amount.toLocaleString("de-CH")}`;

const formatDate = (dateStr: string) =>
    new Date(dateStr + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function MembersBook() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [member, setMember] = useState<MemberBasic | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Read URL params for pre-selection (e.g. /members/book?tab=experience&experience=guided_hike)
    const initialTab = searchParams.get("tab") === "experience" ? "experience" : "sanctuary";
    const initialExperience = experiences.some((e) => e.id === searchParams.get("experience"))
        ? searchParams.get("experience")!
        : "road_journey";

    const [tab, setTab] = useState<"sanctuary" | "experience">(initialTab);

    // Sanctuary form
    const [selectedSanctuary, setSelectedSanctuary] = useState("villars");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");
    const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

    // Experience form
    const [selectedExperience, setSelectedExperience] = useState(initialExperience);
    const [preferredDate, setPreferredDate] = useState("");
    const [expGuests, setExpGuests] = useState(1);
    const [expSpecialRequests, setExpSpecialRequests] = useState("");

    // Availability calendar — fetch booked dates + admin-blocked dates
    const { bookedDates, isLoading: datesLoading } = useBookedDates(selectedSanctuary);
    const { blockedDates: sanctuaryBlockedDates, isLoading: blockedLoading } = useBlockedDates("sanctuary", selectedSanctuary);
    const { blockedDates: experienceBlockedDates } = useBlockedDates("experience", selectedExperience);

    // Combine bookings + admin-blocked dates (deduplicated via Set)
    const allDisabledDates = [...new Set([...bookedDates, ...sanctuaryBlockedDates])];
    const experienceDisabledDates = experienceBlockedDates;

    useEffect(() => {
        loadMember();
    }, []);

    const loadMember = async () => {
        try {
            const { data: memberData, error } = await supabase.rpc("get_member_profile");
            if (error && import.meta.env.DEV) console.error("[Book] Profile load error:", error.message);
            if (!memberData) { navigate("/login"); return; }
            const m = memberData as Record<string, any>;
            setMember({ id: m.id, full_name: m.full_name, email: m.email });
        } catch (err) {
            if (import.meta.env.DEV) console.error("[Book] Failed to load profile:", err);
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAddOn = (id: string) => {
        setSelectedAddOns((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const getAddOnsList = () =>
        experiences.filter((e) => selectedAddOns.includes(e.id));

    const getSanctuaryTotal = () => {
        if (!checkIn || !checkOut) return null;
        const nights = Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
        );
        const sanctuary = sanctuaries.find((s) => s.id === selectedSanctuary);
        if (!sanctuary || nights < 2) return null;
        const staySubtotal = sanctuary.nightlyRate * nights;
        const addOnsSubtotal = getAddOnsList().reduce((sum, e) => sum + e.basePrice, 0);
        return { nights, sanctuary, staySubtotal, addOnsSubtotal, total: staySubtotal + addOnsSubtotal };
    };

    const handleSanctuarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;
        if (!checkIn || !checkOut) { toast.error("Please select your check-in and check-out dates."); return; }

        const calc = getSanctuaryTotal();
        if (!calc) return;

        if (calc.nights < 2) {
            toast.error("Minimum stay is 2 nights.");
            return;
        }
        if (new Date(checkIn) < new Date()) {
            toast.error("Check-in date must be in the future.");
            return;
        }

        setIsSubmitting(true);
        try {
            const addOns = getAddOnsList();
            const addOnsText = addOns.length > 0
                ? `\n\nAdd-ons: ${addOns.map((a) => `${a.name} (${formatCHF(a.basePrice)})`).join(", ")}`
                : "";
            const fullRequests = (specialRequests || "") + addOnsText || null;

            const { data, error } = await supabase.rpc("submit_booking", {
                p_member_id: member.id,
                p_sanctuary_id: selectedSanctuary,
                p_check_in: checkIn,
                p_check_out: checkOut,
                p_guests: guests,
                p_special_requests: fullRequests,
                p_total_nights: calc.nights,
                p_estimated_price: calc.total,
            });

            if (error) throw error;
            const result = data as Record<string, any>;
            if (result?.error) throw new Error(result.error);

            // Send notification email via booking-inquiry Edge Function
            await supabase.functions.invoke("booking-inquiry", {
                body: {
                    sanctuary: calc.sanctuary.name,
                    dateFrom: checkIn,
                    dateTo: checkOut,
                    memberName: member.full_name,
                    memberEmail: member.email,
                    guests,
                    specialRequests: specialRequests || null,
                    addOns: addOns.map((a) => ({ name: a.name, price: a.basePrice })),
                    estimatedTotal: calc.total,
                },
            });

            setSubmitted(true);
            toast.success("Booking request submitted! We'll confirm within 24-48 hours.");
        } catch (error) {
            if (import.meta.env.DEV) console.error("Booking error:", error);
            toast.error("Failed to submit booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExperienceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member) return;
        if (!preferredDate) { toast.error("Please select a preferred date."); return; }

        if (new Date(preferredDate) < new Date()) {
            toast.error("Preferred date must be in the future.");
            return;
        }

        setIsSubmitting(true);
        try {
            const exp = experiences.find((x) => x.id === selectedExperience);
            const estimatedPrice = exp ? exp.basePrice : null;

            const { data, error } = await supabase.rpc("submit_booking", {
                p_member_id: member.id,
                p_experience_type: selectedExperience,
                p_preferred_date: preferredDate,
                p_guests: expGuests,
                p_special_requests: expSpecialRequests || null,
                p_estimated_price: estimatedPrice,
            });

            if (error) throw error;
            const result = data as Record<string, any>;
            if (result?.error) throw new Error(result.error);

            // Send notification email
            const expName = experiences.find((x) => x.id === selectedExperience)?.name || selectedExperience;
            await supabase.functions.invoke("booking-inquiry", {
                body: {
                    sanctuary: `Experience: ${expName}`,
                    dateFrom: preferredDate,
                    dateTo: preferredDate,
                    memberName: member.full_name,
                    memberEmail: member.email,
                    guests: expGuests,
                    specialRequests: expSpecialRequests || null,
                },
            });

            setSubmitted(true);
            toast.success("Experience request submitted! We'll confirm within 24-48 hours.");
        } catch (error) {
            if (import.meta.env.DEV) console.error("Booking error:", error);
            toast.error("Failed to submit request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/10 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (submitted) {
        return (
            <MembersLayout>
                <div className="max-w-2xl mx-auto px-6 py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                            <Check className="text-emerald-400" size={28} />
                        </div>
                        <h1 className="text-4xl font-serif text-white">Request Received</h1>
                        <p className="text-white/60 font-light">
                            Thank you, {member?.full_name.split(" ")[0]}. We'll review your booking request and confirm within 24-48 hours.
                        </p>

                        {/* Enhance CTA — only for sanctuary bookings with dates */}
                        {checkIn && checkOut && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/[0.03] border border-white/10 p-6 text-left max-w-md mx-auto"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-switz-red/10 flex items-center justify-center">
                                        <Sparkles size={18} className="text-switz-red" />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-medium">Personalize your stay</p>
                                        <p className="text-white/40 text-xs">Add extras like early check-in, transfers, or a welcome package.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const params = new URLSearchParams({
                                            guest: member?.full_name || "",
                                            email: member?.email || "",
                                            checkin: checkIn,
                                            checkout: checkOut,
                                        });
                                        navigate(`/enhance?${params.toString()}`);
                                    }}
                                    className="w-full bg-switz-red/10 text-switz-red border border-switz-red/20 px-6 py-3 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                                >
                                    Enhance Your Stay
                                </button>
                            </motion.div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => { setSubmitted(false); setCheckIn(""); setCheckOut(""); setPreferredDate(""); setSpecialRequests(""); setExpSpecialRequests(""); setSelectedAddOns([]); }}
                                className="bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500"
                            >
                                Book Another
                            </button>
                            <button
                                onClick={() => navigate("/members")}
                                className="border border-white/20 text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white/10 transition-all duration-500"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    </motion.div>
                </div>
            </MembersLayout>
        );
    }

    const sanctuaryCalc = getSanctuaryTotal();

    return (
        <MembersLayout>
            <SEO title="Book | Members Area | Swissperiences" />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => navigate("/members")}
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest mb-8 flex items-center gap-2"
                    >
                        <ArrowLeft size={14} /> Back to Dashboard
                    </button>
                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                        Member Booking
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Book Your Experience
                    </h1>
                    <p className="text-white/60 font-light">
                        Select a sanctuary or experience and we'll confirm availability within 24-48 hours.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-10">
                    <button
                        onClick={() => setTab("sanctuary")}
                        className={`px-6 py-3 uppercase tracking-widest text-xs font-bold transition-all duration-300 ${
                            tab === "sanctuary"
                                ? "bg-white text-black"
                                : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
                        }`}
                    >
                        <MapPin size={14} className="inline mr-2" />
                        Sanctuary
                    </button>
                    <button
                        onClick={() => setTab("experience")}
                        className={`px-6 py-3 uppercase tracking-widest text-xs font-bold transition-all duration-300 ${
                            tab === "experience"
                                ? "bg-white text-black"
                                : "bg-white/5 text-white/50 border border-white/10 hover:text-white"
                        }`}
                    >
                        <Calendar size={14} className="inline mr-2" />
                        Experience
                    </button>
                </div>

                {/* Sanctuary Form */}
                {tab === "sanctuary" && (
                    <motion.form
                        key="sanctuary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSanctuarySubmit}
                        className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
                    >
                        {/* Sanctuary Selection */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-3">Select Sanctuary</label>
                            <div className="space-y-3">
                                {sanctuaries.map((s) => (
                                    <label
                                        key={s.id}
                                        className={`flex items-center gap-4 p-4 rounded-sm border cursor-pointer transition-all ${
                                            selectedSanctuary === s.id
                                                ? "border-switz-red bg-switz-red/5"
                                                : "border-white/10 hover:border-glacier-500/20"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="sanctuary"
                                            value={s.id}
                                            checked={selectedSanctuary === s.id}
                                            onChange={() => setSelectedSanctuary(s.id)}
                                            className="sr-only"
                                        />
                                        <img src={s.image} alt={s.name} className="w-16 h-12 object-cover rounded-sm" />
                                        <div className="flex-1">
                                            <span className="text-white text-sm font-medium block">{s.name}</span>
                                            <span className="text-white/40 text-xs">{s.location}</span>
                                        </div>
                                        <span className="text-white/50 text-xs">{s.price}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dates — Availability Calendar */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-3">Select Dates</label>
                            <AvailabilityCalendar
                                disabledDates={allDisabledDates}
                                mode="range"
                                isLoading={datesLoading || blockedLoading}
                                minNights={2}
                                onSelectRange={(ci, co) => {
                                    setCheckIn(ci);
                                    setCheckOut(co);
                                }}
                            />
                            <input type="hidden" value={checkIn} />
                            <input type="hidden" value={checkOut} />
                        </div>

                        {/* Guests */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Guests</label>
                            <select
                                value={guests}
                                onChange={(e) => setGuests(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm focus:border-switz-red focus:outline-none transition-colors"
                            >
                                {[1, 2, 3, 4].map((n) => (
                                    <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                                ))}
                                <option value={5}>5+ Guests — Inquire</option>
                            </select>
                            {guests >= 5 && (
                                <div className="mt-3 flex items-start gap-3 bg-white/[0.03] border border-white/10 p-4">
                                    <MessageCircle size={16} className="text-white/40 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-white/60 text-sm mb-2">For groups of 5 or more, we arrange bespoke stays.</p>
                                        <a
                                            href="https://wa.me/41787002202?text=Hi%2C%20I'd%20like%20to%20book%20a%20sanctuary%20stay%20for%205%2B%20guests."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors font-[Manrope,sans-serif] underline underline-offset-4"
                                        >
                                            Contact us on WhatsApp →
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Add-ons */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-1">Enhance Your Stay</label>
                            <p className="text-white/40 text-xs mb-4">Add curated experiences during your stay.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {experiences.map((exp) => {
                                    const isSelected = selectedAddOns.includes(exp.id);
                                    return (
                                        <button
                                            key={exp.id}
                                            type="button"
                                            aria-pressed={isSelected}
                                            aria-label={`${exp.name} — ${exp.price}`}
                                            onClick={() => toggleAddOn(exp.id)}
                                            className={`flex items-center gap-3 p-4 rounded-sm border text-left transition-all duration-200 ${
                                                isSelected
                                                    ? "border-switz-red bg-switz-red/5"
                                                    : "border-white/10 hover:border-glacier-500/20"
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                                isSelected ? "bg-switz-red/20 text-switz-red" : "bg-white/5 text-white/40"
                                            }`}>
                                                {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <span className="text-white text-sm font-medium block">{exp.name}</span>
                                                <span className="text-white/40 text-xs">{exp.price}</span>
                                            </div>
                                            {isSelected && (
                                                <X size={14} className="text-white/30 shrink-0" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Special Requests <span className="text-white/30">(Optional)</span></label>
                            <textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                rows={3}
                                placeholder="Dietary requirements, transfer needs, celebrations..."
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/30 focus:border-switz-red focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Summary Card */}
                        <AnimatePresence>
                            {sanctuaryCalc && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white/[0.03] border border-white/10 p-6 space-y-4">
                                        <p className="text-[10px] uppercase tracking-widest text-white/40">Booking Summary</p>

                                        {/* Property */}
                                        <div className="flex items-center gap-3">
                                            <img src={sanctuaryCalc.sanctuary.image} alt={sanctuaryCalc.sanctuary.name} className="w-12 h-9 object-cover rounded-sm" />
                                            <div>
                                                <p className="text-white text-sm font-medium">{sanctuaryCalc.sanctuary.name}</p>
                                                <p className="text-white/40 text-xs">{sanctuaryCalc.sanctuary.location}</p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="grid grid-cols-3 gap-4 py-3 border-t border-white/5">
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase tracking-wider">Check-in</p>
                                                <p className="text-white text-xs mt-1">{formatDate(checkIn)}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase tracking-wider">Check-out</p>
                                                <p className="text-white text-xs mt-1">{formatDate(checkOut)}</p>
                                            </div>
                                            <div>
                                                <p className="text-white/40 text-[10px] uppercase tracking-wider">Guests</p>
                                                <p className="text-white text-xs mt-1">{guests} {guests === 1 ? "guest" : "guests"}</p>
                                            </div>
                                        </div>

                                        {/* Line items */}
                                        <div className="space-y-2 pt-2 border-t border-white/5">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-white/60">{sanctuaryCalc.nights} nights x {formatCHF(sanctuaryCalc.sanctuary.nightlyRate)}</span>
                                                <span className="text-white">{formatCHF(sanctuaryCalc.staySubtotal)}</span>
                                            </div>

                                            {getAddOnsList().map((addon) => (
                                                <div key={addon.id} className="flex justify-between text-sm">
                                                    <span className="text-white/60">{addon.name}</span>
                                                    <span className="text-white">{formatCHF(addon.basePrice)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Total */}
                                        <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40">Estimated Total</span>
                                            <span className="text-2xl font-serif text-white">{formatCHF(sanctuaryCalc.total)}</span>
                                        </div>

                                        <p className="text-white/35 text-[10px]">Final amount confirmed by our team before payment.</p>

                                        {/* Cancellation Policy */}
                                        <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                            <ShieldCheck size={14} className="text-emerald-500/70 shrink-0 mt-0.5" />
                                            <p className="text-emerald-400/60 text-xs">Free cancellation up to 7 days before check-in.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !sanctuaryCalc || guests >= 5}
                            className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                            Request This Stay
                        </button>
                        <p className="text-white/40 text-[10px] text-center">You won't be charged now. We'll confirm availability and final price within 24-48 hours.</p>
                    </motion.form>
                )}

                {/* Experience Form */}
                {tab === "experience" && (
                    <motion.form
                        key="experience"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleExperienceSubmit}
                        className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 space-y-6"
                    >
                        {/* Experience Selection */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-3">Select Experience</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {experiences.map((exp) => (
                                    <label
                                        key={exp.id}
                                        className={`flex items-center gap-3 p-4 rounded-sm border cursor-pointer transition-all ${
                                            selectedExperience === exp.id
                                                ? "border-switz-red bg-switz-red/5"
                                                : "border-white/10 hover:border-glacier-500/20"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={exp.id}
                                            checked={selectedExperience === exp.id}
                                            onChange={() => setSelectedExperience(exp.id)}
                                            className="sr-only"
                                        />
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-switz-red shrink-0">
                                            {exp.icon}
                                        </div>
                                        <div>
                                            <span className="text-white text-sm font-medium block">{exp.name}</span>
                                            <span className="text-white/40 text-xs">{exp.price}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Date — Availability Calendar (single mode for experiences) */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-3">Preferred Date</label>
                            <AvailabilityCalendar
                                disabledDates={experienceDisabledDates}
                                mode="single"
                                onSelectDate={(date) => setPreferredDate(date)}
                            />
                            <input type="hidden" value={preferredDate} />
                        </div>

                        {/* Number of People */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Number of People</label>
                            <select
                                value={expGuests}
                                onChange={(e) => setExpGuests(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm focus:border-switz-red focus:outline-none transition-colors"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>
                                ))}
                            </select>
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Special Requests <span className="text-white/30">(Optional)</span></label>
                            <textarea
                                value={expSpecialRequests}
                                onChange={(e) => setExpSpecialRequests(e.target.value)}
                                rows={3}
                                placeholder="Any special requirements or preferences..."
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/30 focus:border-switz-red focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Estimated Price + Cancellation */}
                        {preferredDate && (() => {
                            const exp = experiences.find((x) => x.id === selectedExperience);
                            if (!exp) return null;
                            return (
                                <div className="bg-white/[0.03] border border-white/10 p-5 space-y-3">
                                    <p className="text-[10px] uppercase tracking-widest text-white/40">Booking Summary</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white/60">{exp.name}</span>
                                        <span className="text-white">{formatCHF(exp.basePrice)}</span>
                                    </div>
                                    <p className="text-white/40 text-xs">{formatDate(preferredDate)} · {expGuests} {expGuests === 1 ? "person" : "people"}</p>
                                    <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40">Estimated Total</span>
                                        <span className="text-2xl font-serif text-white">{formatCHF(exp.basePrice)}</span>
                                    </div>
                                    <p className="text-white/35 text-[10px]">Final amount confirmed by our team before payment.</p>
                                    <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                        <ShieldCheck size={14} className="text-emerald-500/70 shrink-0 mt-0.5" />
                                        <p className="text-emerald-400/60 text-xs">Free cancellation up to 7 days before the experience.</p>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                            Request This Experience
                        </button>
                        <p className="text-white/40 text-[10px] text-center">You won't be charged now. We'll confirm availability and final price within 24-48 hours.</p>
                    </motion.form>
                )}
            </main>
        </MembersLayout>
    );
}
