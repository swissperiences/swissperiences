import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const NotFound = () => {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
            <SEO
                title="404 | Swissperiences"
                description="Page not found."
            />

            <div className="max-w-sm w-full text-center">
                <div className="w-16 h-px bg-white/20 mx-auto mb-12" />

                <span className="text-switz-red text-xs font-bold uppercase tracking-[0.4em] block mb-6">
                    404
                </span>

                <h1 className="text-3xl md:text-4xl font-serif text-white mb-4">
                    Lost in the mountains.
                </h1>

                <p className="text-white/60 font-light leading-relaxed mb-12">
                    This page doesn't exist. Perhaps the altitude got to us.
                </p>

                <div className="flex flex-col gap-4">
                    <Link
                        to="/"
                        className="w-full bg-white text-black py-4 text-xs uppercase tracking-widest font-medium hover:bg-white/90 transition-colors text-center"
                    >
                        Back to Homepage
                    </Link>
                    <Link
                        to="/journals"
                        className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                    >
                        Read our Journals →
                    </Link>
                </div>

                <div className="w-16 h-px bg-white/20 mx-auto mt-12" />
            </div>
        </div>
    );
};

export default NotFound;
