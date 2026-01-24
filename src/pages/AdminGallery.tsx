import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";

const images = [
    "/images/loft/IMG_6006.jpg",
    "/images/loft/IMG_8736.jpg",
    "/images/loft/IMG_8759.jpg",
    "/images/loft/IMG_5973.jpg",
    "/images/loft/IMG_4277.jpg",
    "/images/villars-hero.jpg",
    "/images/villars-feature.jpg",
    "/images/apartment-fireplace.jpg",
    "/images/villars-gallery-1.jpg",
    "/images/villars-gallery-2.jpg",
    "/images/villars-gallery-3.jpg",
    "/images/apt-balcony-day.jpg",
    "/images/apt-balcony-sunset.jpg",
    "/images/apt-bathroom.jpg",
    "/images/apt-living-room-1.jpg",
    "/images/apt-living-room-2.jpg",
    "/images/range-rover-villars.jpg",
    "/images/range-rover-enhanced.jpg",
    "/images/villars-drone.jpg",
    "/images/caueh-vidal-spring.jpg",
    "/images/caueh-hiking.jpg",
    "/images/mountain-sunset.jpg",
    "/images/snowy-view.jpg",
    "/images/geneva-jet.jpg",
    "/images/caueh-vidal.jpg"
];

export default function AdminGallery() {
    const copyToClipboard = (path: string) => {
        navigator.clipboard.writeText(path);
        alert(`Copied: ${path}`);
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white p-8">
            <header className="max-w-7xl mx-auto mb-16 flex items-center justify-between">
                <div>
                    <Link to="/" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest mb-4">
                        <ArrowLeft size={14} /> Back to Sanctuary
                    </Link>
                    <h1 className="text-4xl font-serif">Asset Inspector</h1>
                    <p className="text-white/40 text-sm mt-2 font-mono">/public/images/ inspection</p>
                </div>
                <div className="text-right">
                    <span className="text-switz-red text-xs font-bold tracking-widest uppercase">Secret/Internal</span>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {images.map((img, idx) => (
                    <motion.div
                        key={img}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="group bg-white/[0.02] border border-white/10 rounded-sm overflow-hidden"
                    >
                        <div className="aspect-video overflow-hidden bg-neutral-900 relative">
                            <img
                                src={img}
                                alt={img}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button
                                    onClick={() => copyToClipboard(img)}
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    title="Copy Path"
                                >
                                    <Copy size={18} />
                                </button>
                                <a
                                    href={img}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                    title="Open Original"
                                >
                                    <ExternalLink size={18} />
                                </a>
                            </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                            <span className="text-[10px] font-mono text-white/50 truncate pr-4">{img}</span>
                            <button
                                onClick={() => copyToClipboard(img)}
                                className="text-[10px] uppercase tracking-widest text-switz-red hover:text-white transition-colors"
                            >
                                Copy
                            </button>
                        </div>
                    </motion.div>
                ))}
            </main>
        </div>
    );
}
