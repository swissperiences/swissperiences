import { ExternalLink } from "lucide-react";
import type { CuratedActivity } from "@/data/cities";

interface CuratedActivitiesProps {
    activities: CuratedActivity[];
}

export default function CuratedActivities({ activities }: CuratedActivitiesProps) {
    if (!activities.length) return null;

    return (
        <div>
            <span className="text-switz-red text-[10px] uppercase tracking-[0.3em] font-bold block mb-8">
                Worth Exploring
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity, i) => (
                    <a
                        key={i}
                        href={activity.href}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="group flex items-center justify-between border border-white/5 hover:border-white/20 rounded-sm p-6 transition-all duration-500"
                    >
                        <div className="flex-1 min-w-0">
                            <span className="text-white/80 group-hover:text-white font-light transition-colors block truncate">
                                {activity.title}
                            </span>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[9px] uppercase tracking-[0.15em] text-white/25 border border-white/10 px-2 py-0.5">
                                    {activity.type}
                                </span>
                                {activity.duration && (
                                    <span className="text-[9px] text-white/20">{activity.duration}</span>
                                )}
                            </div>
                        </div>
                        <ExternalLink size={12} className="text-white/15 group-hover:text-white/40 transition-colors ml-4 shrink-0" />
                    </a>
                ))}
            </div>
        </div>
    );
}
