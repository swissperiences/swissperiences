import SEO from "@/components/SEO";
import { Clock, Instagram, Linkedin, Mail } from "lucide-react";

const PendingApproval = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <SEO
                title="Application Under Review | Swissperiences"
                description="Your Swissperiences membership application is being personally reviewed."
            />

            <div className="max-w-md text-center">
                <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                <div className="flex justify-center mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-switz-red animate-pulse">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-6">
                    In Review.
                </h1>

                <p className="text-white/60 font-light leading-relaxed mb-6">
                    Thank you for joining our community.
                </p>

                <p className="text-white/60 font-light leading-relaxed mb-12">
                    Our team reviews each application personally to preserve the silence and quality of our sanctuaries.
                    Expect an update via email within 24-48 hours.
                </p>

                <div className="w-16 h-px bg-white/20 mx-auto mb-8" />

                <div className="space-y-6">
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em]">While you wait</p>
                    <div className="flex justify-center gap-8">
                        <a
                            href="https://instagram.com/swissperiences"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
                        >
                            <Instagram className="w-4 h-4 mb-2 mx-auto" />
                            Instagram
                        </a>
                        <a
                            href="https://linkedin.com/company/swissperiences"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest"
                        >
                            <Linkedin className="w-4 h-4 mb-2 mx-auto" />
                            LinkedIn
                        </a>
                    </div>
                </div>

                <div className="mt-12">
                    <a
                        href="/"
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                    >
                        &larr; Back to Homepage
                    </a>
                </div>

                <div className="mt-8 text-white/35 text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-2">
                    <Mail className="w-3 h-3" />
                    hello@swissperiences.ch
                </div>
            </div>
        </div>
    );
};

export default PendingApproval;
