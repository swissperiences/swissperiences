import { useNavigate } from "react-router-dom";

export default function ToDoPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-neutral-950 text-white p-12 font-sans">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="border-b border-white/10 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-serif text-switz-red mb-2">Founder's To-Do List</h1>
                        <p className="text-white/60">Priority Tasks & Roadmap</p>
                    </div>
                    <button onClick={() => navigate("/")} className="text-xs hover:text-switz-red transition-colors">
                        ← Back to Site
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Priority 1: Assets */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">1. Gather Assets (Summer Crossing)</h2>
                        <div className="bg-white/5 p-6 rounded-sm border border-white/10 space-y-4">
                            <TaskItem status="pending" text="Cover: High Alpine Lake (Horizontal)" />
                            <TaskItem status="pending" text="Day 1: Lavaux Vineyards (Sunny)" />
                            <TaskItem status="pending" text="Day 1: Sunset over peaks (Gold hour)" />
                            <TaskItem status="pending" text="Day 2: Lake Brienz boat (Turquoise water)" />
                            <TaskItem status="pending" text="Day 3: Giessbach Grand Hotel (Historic)" />
                        </div>
                    </section>

                    {/* Priority 2: Admin */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">2. Admin & Ops</h2>
                        <div className="bg-white/5 p-6 rounded-sm border border-white/10 space-y-4">
                            <TaskItem status="pending" text="Define nightly rates for Apt" />
                            <TaskItem status="pending" text="Set pricing for Day Trips" />
                            <TaskItem status="done" text="Create Booking inquiry flow" />
                        </div>
                    </section>

                    {/* Priority 3: Outreach */}
                    <section className="space-y-6">
                        <h2 className="text-2xl font-serif border-l-2 border-switz-red pl-4">3. Launch</h2>
                        <div className="bg-white/5 p-6 rounded-sm border border-white/10 space-y-4">
                            <TaskItem status="pending" text="Send specific link to 5 beta testers" />
                            <TaskItem status="pending" text="Post launch video on Instagram" />
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}

const TaskItem = ({ status, text }: { status: 'pending' | 'done', text: string }) => (
    <div className="flex items-center gap-3 group">
        <div className={`w-5 h-5 border rounded flex items-center justify-center transition-colors ${status === 'done' ? 'bg-switz-red border-switz-red' : 'border-white/30 group-hover:border-switz-red'}`}>
            {status === 'done' && <span className="text-xs">✓</span>}
        </div>
        <span className={`font-light ${status === 'done' ? 'text-white/30 line-through' : 'text-white/80'}`}>{text}</span>
    </div>
);
