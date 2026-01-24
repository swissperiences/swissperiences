import { motion } from "framer-motion";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const JournalsTeaser = () => {
    const { t, i18n } = useTranslation('home');
    const navigate = useNavigate();

    const dossiers = [
        {
            id: 'wager',
            title: 'Wager, Andreia & Helena',
            subtitle: 'The Winter Ascent',
            image: '/images/guests/wager/uploaded_image_0_1769163527795.jpg'
        },
        {
            id: 'ale-alex',
            title: 'Ale & Alex',
            subtitle: 'The Alpine Protocol',
            image: '/images/guests/ale_alex/1.jpg'
        }
    ];

    return (
        <section id="journals" className="py-32 px-6 bg-background relative overflow-hidden scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-switz-red text-xs font-bold tracking-[0.3em] uppercase block mb-4">
                            {t('journalsTeaser.heading')}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                            {t('journalsTeaser.title')}
                        </h2>
                        <p className="text-white/60 font-light text-lg">
                            {t('journalsTeaser.description')}
                        </p>
                    </div>

                    <button
                        onClick={() => navigate(`/${i18n.language}/journals`)}
                        className="group flex items-center gap-3 text-white text-xs uppercase tracking-[0.2em] hover:text-switz-red transition-all duration-500"
                    >
                        {t('journalsTeaser.cta')}
                        <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {dossiers.map((journal, index) => (
                        <motion.div
                            key={journal.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            onClick={() => navigate(`/${i18n.language}/journals`)}
                            className="group relative aspect-[16/9] overflow-hidden cursor-pointer rounded-sm"
                        >
                            <img
                                src={journal.image}
                                alt={journal.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-swiss-luxury"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <span className="text-switz-red text-[10px] uppercase tracking-[0.2em] mb-2 block">Archive 0{index + 1}</span>
                                <h3 className="text-white font-serif text-2xl mb-1">{journal.title}</h3>
                                <p className="text-white/60 text-xs italic tracking-wide">{journal.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default JournalsTeaser;
