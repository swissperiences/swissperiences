import { useNavigate } from "react-router-dom";

export default function IdeasPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="border-b border-white/10 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif text-switz-red mb-2">Internal Brainstorming</h1>
                        <p className="text-white/60">Concepts, Intakes & Future Offerings</p>
                    </div>
                    <button onClick={() => navigate("/")} className="text-xs hover:text-switz-red transition-colors">
                        ← Back to Site
                    </button>
                </div>

                {/* Section 1: Upcoming Intakes (Seasonal) */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">1. Upcoming Intake Concepts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <IdeaCard
                            title="The Spring Awakening"
                            date="May 2026"
                            concept="Alpine flowers, waking up the mountains, first hikes without snow."
                            assets="Use drone shots of green valleys + snowy peaks."
                        />

                        <IdeaCard
                            title="Autumn Creative Retreat"
                            date="Oct 2026"
                            concept="Photography & Content Creation workshop. Golden larch trees."
                            assets="Focus on drone videography workshops."
                        />

                        <IdeaCard
                            title="Deep Winter Silence"
                            date="Jan 2027"
                            concept="Snowshoeing, fondue in hidden chalet, absolute silence."
                            assets="Cozy apartment vibes + fireplace."
                        />

                    </div>
                </section>

                {/* Section 2: Road Trip Loops */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">2. Luxury Road Journeys (Swiss Romande)</h2>
                    <ul className="space-y-4 text-white/70">
                        <li>• <strong>Vineyard & Lake:</strong> Villars → Lavaux (Wine Tasting) → Montreux (Jazz/Lake) → Return</li>
                        <li>• <strong>Cheese & Castle:</strong> Villars → Gruyères (Castle/Cheese) → Broc (Chocolate) → Gstaad (Luxury stroll)</li>
                        <li>• <strong>High Pass Adventure:</strong> Villars → Glacier 3000 → Gstaad → Mountain Passes</li>
                    </ul>
                </section>

                {/* Section 3: Bespoke Ideas (Assets to Leverage) */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">3. Asset Leverage Ideas</h2>
                    <div className="bg-white/5 p-6 rounded-sm border border-white/10">
                        <h3 className="text-xl mb-4">Content Creation Package</h3>
                        <p className="mb-4 text-white/60">Target: Influencers / Brands</p>
                        <ul className="list-disc pl-5 space-y-2 text-white/70">
                            <li>Use luxury SUV as "Hero Prop" for their shots</li>
                            <li>Provide Drone footage of them driving</li>
                            <li>Stay in Villars Apt as "Home Base"</li>
                        </ul>
                    </div>
                </section>

            </div>
        </div>
    );
}

interface IdeaCardProps {
    title: string;
    date: string;
    concept: string;
    assets: string;
}

const IdeaCard = ({ title, date, concept, assets }: IdeaCardProps) => (
    <div className="bg-white/5 p-6 rounded-sm border border-white/10 hover:border-switz-red/50 transition-colors">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-medium">{title}</h3>
            <span className="text-xs bg-white/10 px-2 py-1 rounded">{date}</span>
        </div>
        <p className="text-white/70 mb-4 text-sm">{concept}</p>
        <p className="text-xs text-switz-red uppercase tracking-wider">Assets: {assets}</p>
    </div>
);
