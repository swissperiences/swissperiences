import { useState } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Copy, Check, Link2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const SITE_URL = "https://www.swissperiences.ch";

const MESSAGE_TEMPLATE = (name: string, link: string) =>
    `Hi ${name}! Thank you for booking with us. We're excited to host you at The Villars Loft.

If you'd like to make your stay even more special, we've put together a selection of curated experiences and extras just for you:

${link}

From alpine adventures to a private chef dinner — browse at your leisure. No pressure at all, just options if you're interested.

Looking forward to welcoming you!
— The Swissperiences Team`;

export default function LinkGenerator() {
    const [guestName, setGuestName] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [copiedLink, setCopiedLink] = useState(false);
    const [copiedMsg, setCopiedMsg] = useState(false);

    const buildLink = () => {
        const params = new URLSearchParams();
        if (guestName.trim()) params.set("guest", guestName.trim());
        if (checkIn) params.set("checkin", checkIn);
        if (checkOut) params.set("checkout", checkOut);
        const qs = params.toString();
        return `${SITE_URL}/enhance${qs ? `?${qs}` : ""}`;
    };

    const link = buildLink();
    const message = guestName.trim()
        ? MESSAGE_TEMPLATE(guestName.trim().split(" ")[0], link)
        : "";

    const copyToClipboard = async (text: string, type: "link" | "msg") => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === "link") {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
            } else {
                setCopiedMsg(true);
                setTimeout(() => setCopiedMsg(false), 2000);
            }
            toast.success("Copied to clipboard!");
        } catch {
            toast.error("Failed to copy. Please select and copy manually.");
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <SEO title="Link Generator | Swissperiences" />
            <Navigation />

            <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
                <div className="mb-10">
                    <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-4">
                        Host Tools
                    </span>
                    <h1 className="text-4xl font-serif text-white mb-3">
                        Guest Link Generator
                    </h1>
                    <p className="text-white/50 font-light">
                        Generate a personalized enhance link for Airbnb guests. Copy the link or the full message template.
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white/5 border border-white/10 rounded-sm p-6 sm:p-8 space-y-5 mb-8">
                    <div>
                        <label className="text-white/30 text-xs block mb-1">Guest Name</label>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            placeholder="e.g. Marco Rossi"
                            className="w-full bg-black/30 border border-white/10 text-white px-4 py-3 text-sm placeholder:text-white/20 focus:border-switz-red focus:outline-none transition-colors"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
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

                {/* Generated Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                >
                    {/* Link */}
                    <div className="bg-white/[0.03] border border-white/10 p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Link2 size={14} className="text-switz-red" />
                                <p className="text-[10px] uppercase tracking-widest text-white/40">Generated Link</p>
                            </div>
                            <button
                                onClick={() => copyToClipboard(link, "link")}
                                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                            >
                                {copiedLink ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                {copiedLink ? "Copied" : "Copy"}
                            </button>
                        </div>
                        <p className="text-white/80 text-sm break-all font-mono bg-black/30 p-3 rounded-sm border border-white/5">
                            {link}
                        </p>
                    </div>

                    {/* Message Template */}
                    {guestName.trim() && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="bg-white/[0.03] border border-white/10 p-5 space-y-3 overflow-hidden"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={14} className="text-switz-red" />
                                    <p className="text-[10px] uppercase tracking-widest text-white/40">Airbnb Message Template</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(message, "msg")}
                                    className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
                                >
                                    {copiedMsg ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                    {copiedMsg ? "Copied" : "Copy"}
                                </button>
                            </div>
                            <pre className="text-white/60 text-sm whitespace-pre-wrap font-sans bg-black/30 p-4 rounded-sm border border-white/5 leading-relaxed">
                                {message}
                            </pre>
                        </motion.div>
                    )}
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
