import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Car, Mountain, Camera, ChefHat, Clock, Coffee, Truck, Check, Plus, X, ShieldCheck, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

interface AddOnItem {
    id: string;
    name: string;
    description: string;
    price: number;
    icon: React.ReactNode;
    category: "experience" | "extra";
}

const addOns: AddOnItem[] = [
    // Experiences
    { id: "road_journey", name: "Alps Road Journey", description: "Scenic drive through legendary alpine passes with a local guide.", price: 850, icon: <Car size={18} />, category: "experience" },
    { id: "guided_hike", name: "Guided Alpine Hike", description: "Half-day trek with a certified mountain guide. All levels.", price: 300, icon: <Mountain size={18} />, category: "experience" },
    { id: "cinematic_memories", name: "Cinematic Memories", description: "Professional photo & video session of your Swiss journey.", price: 600, icon: <Camera size={18} />, category: "experience" },
    { id: "private_chef", name: "Private Chef Evening", description: "Multi-course dinner prepared in your loft by a local chef.", price: 400, icon: <ChefHat size={18} />, category: "experience" },
    // Extras
    { id: "early_checkin", name: "Early Check-in (10:00)", description: "Arrive early and settle in. Subject to availability.", price: 50, icon: <Clock size={18} />, category: "extra" },
    { id: "late_checkout", name: "Late Check-out (14:00)", description: "No rush. Enjoy a slow morning before departure.", price: 50, icon: <Clock size={18} />, category: "extra" },
    { id: "transfer", name: "Station Transfer", description: "Private pick-up from Aigle or Bex station to the loft.", price: 80, icon: <Truck size={18} />, category: "extra" },
    { id: "welcome_package", name: "Welcome Package", description: "Local wine, artisan cheese, and Swiss chocolate on arrival.", price: 75, icon: <Coffee size={18} />, category: "extra" },
];

const formatCHF = (amount: number) =>
    `CHF ${amount.toLocaleString("de-CH")}`;

export default function GuestEnhance() {
    const [searchParams] = useSearchParams();
    const prefillName = searchParams.get("guest") || "";
    const prefillEmail = searchParams.get("email") || "";
    const prefillCheckin = searchParams.get("checkin") || "";
    const prefillCheckout = searchParams.get("checkout") || "";

    const [guestName, setGuestName] = useState(prefillName);
    const [guestEmail, setGuestEmail] = useState(prefillEmail);
    const [checkIn, setCheckIn] = useState(prefillCheckin);
    const [checkOut, setCheckOut] = useState(prefillCheckout);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const toggle = (id: string) =>
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );

    const selected = useMemo(
        () => addOns.filter((a) => selectedIds.includes(a.id)),
        [selectedIds]
    );

    const total = useMemo(
        () => selected.reduce((sum, a) => sum + a.price, 0),
        [selected]
    );

    const experiences = addOns.filter((a) => a.category === "experience");
    const extras = addOns.filter((a) => a.category === "extra");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestName.trim() || !guestEmail.trim()) {
            toast.error("Please fill in your name and email.");
            return;
        }
        if (selected.length === 0) {
            toast.error("Please select at least one experience or extra.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/send-guest-inquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    guestName: guestName.trim(),
                    guestEmail: guestEmail.trim(),
                    checkIn: checkIn || null,
                    checkOut: checkOut || null,
                    selections: selected.map((a) => ({ id: a.id })),
                    notes: notes.trim() || null,
                }),
            });

            if (!res.ok) throw new Error("Request failed");

            setSubmitted(true);
            toast.success("Request sent! We'll be in touch shortly.");
        } catch {
            toast.error("Something went wrong. Please try again or email hello@swissperiences.ch.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-black">
                <Navigation />
                <div className="max-w-2xl mx-auto px-6 py-32 text-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                            <Check className="text-emerald-400" size={28} />
                        </div>
                        <h1 className="text-4xl font-serif text-white">Request Received</h1>
                        <p className="text-white/60 font-light max-w-md mx-auto">
                            Thank you, {guestName.split(" ")[0]}. We'll confirm availability and get back to you within 24 hours.
                        </p>
                        <p className="text-white/30 text-xs">
                            Questions? Email us at <a href="mailto:hello@swissperiences.ch" className="text-white/50 underline">hello@swissperiences.ch</a>
                        </p>
                    </motion.div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black">
            <SEO
                title="Enhance Your Stay | Swissperiences"
                description="Add curated Alpine experiences and extras to your Villars stay."
            />
            <Navigation />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                {/* Header */}
                <div className="mb-12 text-center">
                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                        The Villars Loft
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                        Enhance Your Stay
                    </h1>
                    <p className="text-white/50 font-light max-w-lg mx-auto">
                        Make your time in the Swiss Alps unforgettable. Browse curated experiences and extras — we'll handle the rest.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Guest Info */}
                    <div className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 space-y-4">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">Your Details</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/30 text-xs block mb-1">Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-white/30 text-xs block mb-1">Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={guestEmail}
                                    onChange={(e) => setGuestEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-white/30 text-xs block mb-1">Check-in</label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm focus:border-switz-red focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-white/30 text-xs block mb-1">Check-out</label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm focus:border-switz-red focus:outline-none transition-colors"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Experiences */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Curated Experiences</p>
                        <p className="text-white/25 text-xs mb-4">Handpicked by our local hosts. Available during your stay.</p>
                        <div className="space-y-3">
                            {experiences.map((item) => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        aria-label={`${item.name} — ${formatCHF(item.price)}`}
                                        onClick={() => toggle(item.id)}
                                        className={`w-full flex items-start gap-4 p-5 rounded-sm border text-left transition-all duration-200 ${
                                            isSelected
                                                ? "border-switz-red bg-switz-red/5"
                                                : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                            isSelected ? "bg-switz-red/20 text-switz-red" : "bg-white/5 text-white/40"
                                        }`}>
                                            {isSelected ? <Check size={16} /> : item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-white text-sm font-medium block">{item.name}</span>
                                            <span className="text-white/35 text-xs block mt-1">{item.description}</span>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="text-white/70 text-sm">{formatCHF(item.price)}</span>
                                            {isSelected && <X size={12} className="text-white/30 mt-1 ml-auto" />}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Extras */}
                    <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Extras</p>
                        <p className="text-white/25 text-xs mb-4">Small touches that make a big difference.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {extras.map((item) => {
                                const isSelected = selectedIds.includes(item.id);
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        aria-pressed={isSelected}
                                        aria-label={`${item.name} — ${formatCHF(item.price)}`}
                                        onClick={() => toggle(item.id)}
                                        className={`flex items-center gap-3 p-4 rounded-sm border text-left transition-all duration-200 ${
                                            isSelected
                                                ? "border-switz-red bg-switz-red/5"
                                                : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                                        }`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                                            isSelected ? "bg-switz-red/20 text-switz-red" : "bg-white/5 text-white/40"
                                        }`}>
                                            {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-white text-sm font-medium block">{item.name}</span>
                                            <span className="text-white/40 text-xs">{formatCHF(item.price)}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest text-white/40 block mb-2">
                            Anything else? <span className="text-white/20">(Optional)</span>
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Preferred dates, dietary requirements, travelling solo or with company..."
                            className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors resize-none"
                        />
                    </div>

                    {/* Summary */}
                    <AnimatePresence>
                        {selected.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white/[0.03] border border-white/10 p-6 space-y-3">
                                    <p className="text-[10px] uppercase tracking-widest text-white/40">Your Selection</p>

                                    <div className="space-y-2">
                                        {selected.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span className="text-white/60">{item.name}</span>
                                                <span className="text-white">{formatCHF(item.price)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                                        <span className="text-[10px] uppercase tracking-widest text-white/40">Estimated Total</span>
                                        <span className="text-2xl font-serif text-white">{formatCHF(total)}</span>
                                    </div>

                                    <p className="text-white/20 text-[10px]">Final pricing confirmed after we check availability.</p>

                                    <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                                        <ShieldCheck size={14} className="text-emerald-500/70 shrink-0 mt-0.5" />
                                        <p className="text-emerald-400/60 text-xs">Free cancellation up to 7 days before your stay.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || selected.length === 0}
                        className="w-full bg-white text-black py-4 uppercase tracking-widest text-xs font-bold hover:bg-switz-red hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={14} />}
                        Send Request
                    </button>
                    <p className="text-white/30 text-[10px] text-center">
                        No payment now. We'll reach out to confirm details and arrange everything.
                    </p>
                </form>
            </main>

            <Footer />
        </div>
    );
}
