import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Share2 } from "lucide-react";
import { journals } from "@/data/journals";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Breadcrumbs, { buildBreadcrumbJsonLd } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";

export default function JournalPost() {
    const { slug, lang } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation("common");
    const journal = journals.find(j => j.slug === slug);

    const langPrefix = lang ? `/${lang}` : "";
    const currentLang = i18n.language || "en";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!journal) {
        return (
            <div className="bg-black min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Post Not Found</h1>
                    <button onClick={() => navigate('/journals')} className="text-switz-red hover:underline">
                        Return to Archives
                    </button>
                </div>
            </div>
        );
    }

    const BASE_URL = "https://www.swissperiences.ch";
    const langUrl = currentLang !== "en" ? `/${currentLang}` : "";

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
        { label: t("breadcrumbs.home", "Home"), href: `${BASE_URL}${langUrl}/` },
        { label: t("breadcrumbs.journals", "Journals"), href: `${BASE_URL}${langUrl}/journals` },
        { label: journal.title, href: `${BASE_URL}${langUrl}/journals/${journal.slug}` },
    ]);

    const breadcrumbItems = [
        { label: t("breadcrumbs.home", "Home"), href: `${langPrefix}/` },
        { label: t("breadcrumbs.journals", "Journals"), href: `${langPrefix}/journals` },
        { label: journal.title },
    ];

    const articleStructuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": journal.title,
        "description": journal.description,
        "image": `${BASE_URL}${journal.coverImage}`,
        "datePublished": journal.date,
        "author": {
            "@type": "Organization",
            "name": "Swissperiences"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Swissperiences",
            "url": BASE_URL
        }
    };

    return (
        <div className="bg-neutral-950 min-h-screen text-white">
            <SEO
                title={`${journal.title} | Swissperiences Journals`}
                description={journal.description}
                canonical={`${BASE_URL}/journals/${journal.slug}`}
                ogImage={`${BASE_URL}${journal.coverImage}`}
                ogType="article"
                structuredData={[articleStructuredData, breadcrumbJsonLd]}
            />
            <Navigation />

            <article className="pt-32 pb-24">
                {/* HERO */}
                <div className="max-w-4xl mx-auto px-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <Breadcrumbs items={breadcrumbItems} />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-4 text-switz-red text-xs uppercase tracking-[0.25em] font-bold mb-6">
                            <span>Journal Entry</span>
                            <span className="w-12 h-px bg-switz-red/30"></span>
                            <span>{journal.date}</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
                            {journal.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-white/60 font-light italic font-serif leading-relaxed">
                            "{journal.quote}"
                        </p>
                    </motion.div>
                </div>

                {/* COVER IMAGE */}
                <div className="w-full aspect-[21/9] md:aspect-[2.4/1] overflow-hidden mb-24 relative">
                    <img
                        src={journal.coverImage}
                        alt={journal.title}
                        className={cn(
                            "w-full h-full object-cover",
                            journal.coverPosition || "object-center"
                        )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                </div>

                {/* CONTENT */}
                <div className="max-w-3xl mx-auto px-6 relative">
                    {/* Share sidebar - hidden on mobile */}
                    <div className="hidden lg:block absolute -left-32 top-0 text-white/20">
                        <div className="sticky top-32 flex flex-col gap-8 items-center">
                            <span className="[writing-mode:vertical-rl] text-xs uppercase tracking-[0.3em] font-light">Share Experiment</span>
                            <button className="hover:text-white transition-colors"><Share2 size={16} /></button>
                        </div>
                    </div>

                    <div className="prose prose-invert prose-lg mb-24 font-light text-white/80 leading-loose">
                        {journal.content.map((paragraph, idx) => (
                            <p key={idx} className="mb-8 first:first-letter:text-7xl first:first-letter:font-serif first:first-letter:text-switz-red first:first-letter:mr-3 first:first-letter:float-left">
                                {paragraph}
                            </p>
                        ))}
                    </div>

                    <div className="w-24 h-px bg-white/10 mx-auto mb-24"></div>

                    {/* ITINERARY RECAP */}
                    <div className="mb-24">
                        <h3 className="text-2xl font-serif text-white mb-16 text-center italic">The Itinerary in Detail</h3>
                        <div className="space-y-24">
                            {journal.itinerary.map((item, iIdx) => (
                                <div key={iIdx} className="group grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                    <div className={cn("order-1", iIdx % 2 !== 0 ? "md:order-2" : "md:order-1")}>
                                        <div className="aspect-[4/3] overflow-hidden rounded-sm relative">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className={cn(
                                                    "w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700",
                                                    item.position || "object-center"
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className={cn("order-2 space-y-4", iIdx % 2 !== 0 ? "md:order-1 md:text-right" : "md:order-2 md:text-left")}>
                                        <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block">
                                            {item.day}
                                        </span>
                                        <h4 className="text-3xl font-serif text-white">{item.title}</h4>
                                        <p className="text-white/60 font-light text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* NEXT CTA */}
                <div className="text-center pt-24 pb-12 bg-neutral-900/30">
                    <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-8">Ready for your own chapter?</p>
                    <button
                        onClick={() => navigate("/#upcoming-retreats")}
                        className="bg-switz-red text-white px-12 py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-500"
                    >
                        Start Your Journey
                    </button>
                </div>

            </article>
            <Footer />
        </div>
    );
}
