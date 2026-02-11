import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { useBookedDates } from "@/hooks/useBookedDates";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { Calendar, MapPin, Users, Mountain, Car, Camera, ChefHat, ArrowLeft, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface MemberBasic {
    id: string;
    full_name: string;
    email: string;
}

const sanctuaries = [
    { id: "villars", name: "The Villars Loft", location: "Villars-sur-Ollon", price: "From CHF 1,200/night", image: "/images/villars-hero.jpg" },
];

const experiences = [
    { id: "road_journey", name: "Alps Road Journey", icon: <Car size={18} />, price: "From CHF 850" },
    { id: "guided_hike", name: "Guided Alpine Hike", icon: <Mountain size={18} />, price: "From CHF 300" },
    { id: "cinematic_memories", name: "Cinematic Memories", icon: <Camera size={18} />, price: "From CHF 600" },
    { id: "private_chef", name: "Private Chef", icon: <ChefHat size={18} />, price: "From CHF 400" },
];

export default function MembersBook() {
    const navigate = useNavigate();
    const [member, setMember] = useState<MemberBasic | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [tab, setTab] = useState<"sanctuary" | "experience">("sanctuary");

    // Sanctuary form
    const [selectedSanctuary, setSelectedSanctuary] = useState("villars");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState("");

    // Experience form
    const [selectedExperience, setSelectedExperience] = useState("road_journey");
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
            const { data: memberData } = await supabase.rpc("get_member_profile");
            if (!memberData) {
                navigate("/login");
                return;
            }
            const m = memberData as Record<string, any>;
            setMember({ id: m.id, full_name: m.full_name, email: m.email });
        } catch {
            navigate("/login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSanctuarySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member || !checkIn || !checkOut) return;

        const nights = Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
        );
        if (nights < 2) {
            toast.error("Minimum stay is 2 nights.");
            return;
        }
        if (new Date(checkIn) < new Date()) {
            toast.error("Check-in date must be in the future.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase.rpc("submit_booking", {
                p_member_id: member.id,
                p_sanctuary_id: selectedSanctuary,
                p_check_in: checkIn,
                p_check_out: checkOut,
                p_guests: guests,
                p_special_requests: specialRequests || null,
                p_total_nights: nights,
            });

            if (error) throw error;
            const result = data as Record<string, any>;
            if (result?.error) throw new Error(result.error);

            // Send notification email via booking-inquiry Edge Function
            await supabase.functions.invoke("booking-inquiry", {
                body: {
                    sanctuary: sanctuaries.find((s) => s.id === selectedSanctuary)?.name || selectedSanctuary,
                    dateFrom: checkIn,
                    dateTo: checkOut,
                    memberName: member.full_name,
                    memberEmail: member.email,
                },
            });

            setSubmitted(true);
            toast.success("Booking request submitted! We'll confirm within 24-48 hours.");
        } catch (error) {
            console.error("Booking error:", error);
            toast.error("Failed to submit booking. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleExperienceSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!member || !preferredDate) return;

        if (new Date(preferredDate) < new Date()) {
            toast.error("Preferred date must be in the future.");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase.rpc("submit_booking", {
                p_member_id: member.id,
                p_experience_type: selectedExperience,
                p_preferred_date: preferredDate,
                p_guests: expGuests,
                p_special_requests: expSpecialRequests || null,
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
                },
            });

            setSubmitted(true);
            toast.success("Experience request submitted! We'll confirm within 24-48 hours.");
        } catch (error) {
            console.error("Booking error:", error);
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
            <div className="min-h-screen bg-black">
                <Navigation />
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
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <button
                                onClick={() => { setSubmitted(false); setCheckIn(""); setCheckOut(""); setPreferredDate(""); setSpecialRequests(""); setExpSpecialRequests(""); }}
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
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <SEO title="Book | Members Area | Swissperiences" />
            <Navigation />

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
                                                : "border-white/10 hover:border-white/20"
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
                                onSelectRange={(ci, co, nights) => {
                                    setCheckIn(ci);
                                    setCheckOut(co);
                                }}
                            />
                            {/* Hidden inputs for form validation */}
                            <input type="hidden" value={checkIn} required />
                            <input type="hidden" value={checkOut} required />
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
                            </select>
                        </div>

                        {/* Special Requests */}
                        <div>
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Special Requests <span className="text-white/20">(Optional)</span></label>
                            <textarea
                                value={specialRequests}
                                onChange={(e) => setSpecialRequests(e.target.value)}
                                rows={3}
                                placeholder="Dietary requirements, transfer needs, celebrations..."
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                            Submit Booking Request
                        </button>
                        <p className="text-white/30 text-[10px] text-center">Minimum 2-night stay. We'll confirm availability within 24-48 hours.</p>
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
                                                : "border-white/10 hover:border-white/20"
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
                            <input type="hidden" value={preferredDate} required />
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
                            <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">Special Requests <span className="text-white/20">(Optional)</span></label>
                            <textarea
                                value={expSpecialRequests}
                                onChange={(e) => setExpSpecialRequests(e.target.value)}
                                rows={3}
                                placeholder="Any special requirements or preferences..."
                                className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                            Submit Experience Request
                        </button>
                        <p className="text-white/30 text-[10px] text-center">We'll confirm availability within 24-48 hours.</p>
                    </motion.form>
                )}
            </main>

            <Footer />
        </div>
    );
}
