import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SEO from "@/components/SEO";

const RequestAccess = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        city: "",
        country: "",
        reason: "",
        referralSource: "",
        referralDetail: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('membership_applications')
                .insert({
                    full_name: formData.fullName,
                    email: formData.email,
                    city: formData.city,
                    country: formData.country,
                    reason: formData.reason,
                    referral_source: formData.referralSource,
                    referral_detail: formData.referralDetail
                });

            if (error) throw error;

            setIsSubmitted(true);
        } catch (error: any) {
            console.error('Error submitting application:', error);
            if (error.code === '23505' || error.message?.includes('duplicate') || error.details?.includes('already exists')) {
                toast.error("This email has already applied. We'll be in touch soon.");
            } else {
                console.error('Submission error details:', error);
                toast.error("Something went wrong. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success state
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center px-6">
                <SEO
                    title="Application Received | Swissperiences"
                    description="Thank you for your application to Swissperiences."
                />
                <div className="max-w-md text-center">
                    <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                    <h1 className="text-3xl md:text-4xl font-serif text-white mb-6">
                        Thank you.
                    </h1>

                    <p className="text-white/60 font-light leading-relaxed mb-4">
                        Your application has been received.
                    </p>
                    <p className="text-white/60 font-light leading-relaxed mb-8">
                        We review each request personally.
                        Expect to hear from us within 48 hours.
                    </p>

                    <div className="w-16 h-px bg-white/20 mx-auto mb-8" />

                    <p className="text-white/40 text-sm mb-6">In the meantime, follow our journey:</p>

                    <div className="flex justify-center gap-8">
                        <a
                            href="https://instagram.com/swissperiences"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://linkedin.com/company/swissperiences"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Application form
    return (
        <div className="min-h-screen bg-black">
            <SEO
                title="Request Access | Swissperiences"
                description="Apply for exclusive access to Swissperiences' curated alpine sanctuaries."
            />

            {/* Background subtle gradient */}
            <div className="fixed inset-0 bg-gradient-to-b from-black via-black to-neutral-950" />

            <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">

                {/* Left side - Branding & Philosophy */}
                <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-center">
                    <a href="/" className="text-white/60 hover:text-white transition-colors text-xs uppercase tracking-[0.3em] mb-16 inline-block">
                        &larr; Back
                    </a>

                    <div className="max-w-md">
                        <span className="text-switz-red text-[10px] font-bold uppercase tracking-[0.4em] block mb-6">
                            Request Access
                        </span>

                        <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-8">
                            Switzerland is boring.
                            <span className="block text-white/40 italic mt-2">Thank god.</span>
                        </h1>

                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            Swissperiences is a private network of curated alpine sanctuaries
                            for those seeking silence in a noisy world.
                        </p>

                        <p className="text-white/60 font-light leading-relaxed mb-8">
                            Membership is by application only.
                            We review each request personally to ensure alignment
                            with our community.
                        </p>

                        <div className="w-16 h-px bg-white/10 mb-8" />

                        <p className="text-white/40 text-sm italic font-serif">
                            "True luxury is the privilege of being unavailable."
                        </p>
                    </div>
                </div>

                {/* Right side - Form */}
                <div className="lg:w-1/2 p-8 md:p-16 lg:p-24 flex items-center justify-center bg-white/[0.02]">
                    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">

                        {/* Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
                                placeholder="Your name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
                                placeholder="your@email.com"
                            />
                        </div>

                        {/* City & Country */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="city" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
                                    placeholder="London"
                                />
                            </div>
                            <div>
                                <label htmlFor="country" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
                                    placeholder="United Kingdom"
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label htmlFor="reason" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                What brought you here?
                            </label>
                            <textarea
                                id="reason"
                                name="reason"
                                rows={3}
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20 resize-none"
                                placeholder="Tell us a bit about what you're seeking..."
                            />
                        </div>

                        {/* Referral Source */}
                        <div>
                            <label htmlFor="referralSource" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                How did you find us?
                            </label>
                            <select
                                id="referralSource"
                                name="referralSource"
                                value={formData.referralSource}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors appearance-none cursor-pointer"
                            >
                                <option value="" className="bg-black">Select one...</option>
                                <option value="linkedin" className="bg-black">LinkedIn</option>
                                <option value="instagram" className="bg-black">Instagram</option>
                                <option value="friend" className="bg-black">Friend or colleague</option>
                                <option value="google" className="bg-black">Google search</option>
                                <option value="press" className="bg-black">Press / Article</option>
                                <option value="other" className="bg-black">Other</option>
                            </select>
                        </div>

                        {/* Referral Detail (conditional) */}
                        {(formData.referralSource === 'friend' || formData.referralSource === 'other') && (
                            <div>
                                <label htmlFor="referralDetail" className="block text-white/40 text-xs uppercase tracking-widest mb-3">
                                    {formData.referralSource === 'friend' ? "Who referred you?" : "Please specify"}
                                </label>
                                <input
                                    type="text"
                                    id="referralDetail"
                                    name="referralDetail"
                                    value={formData.referralDetail}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-white/60 transition-colors placeholder:text-white/20"
                                />
                            </div>
                        )}

                        {/* Submit */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black py-4 text-sm uppercase tracking-widest font-medium hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>

                            <p className="text-white/30 text-xs text-center mt-6">
                                Applications reviewed within 48 hours
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestAccess;
