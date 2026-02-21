import { Link } from "react-router-dom";
import MembershipGate from "./MembershipGate";

interface Season {
  id: string;
  name: string;
  months: string;
  tagline: string;
  activities: string[];
  image: string;
}

const seasons: Season[] = [
  {
    id: "winter",
    name: "Winter",
    months: "December — March",
    tagline: "The silence of snow.",
    activities: ["Skiing & Snowboarding", "Thermal Baths", "Fondue by Fireplace", "Snowshoeing"],
    image: "/images/villars/ski-sunset-golden.jpeg",
  },
  {
    id: "spring",
    name: "Spring",
    months: "April — June",
    tagline: "The mountain awakens.",
    activities: ["Mountain Biking (VTT)", "Wildflower Hikes", "Lavaux Vineyard Tours", "First Terrasses"],
    image: "/images/caueh-vidal-spring.jpg",
  },
  {
    id: "summer",
    name: "Summer",
    months: "July — August",
    tagline: "Alpine lakes, endless light.",
    activities: ["Stand-Up Paddle", "Kayaking", "Lake Swimming", "Mountain Biking (VTT)"],
    image: "/images/drone/lake-brienz-aerial.jpg",
  },
  {
    id: "autumn",
    name: "Autumn",
    months: "September — November",
    tagline: "Golden silence.",
    activities: ["Autumn Foliage Hikes", "Wine Harvest (Lavaux)", "Raclette Evenings", "Mushroom Foraging"],
    image: "/images/drone/villars-autumn-sunset.jpg",
  },
];

function getCurrentSeasonId(): string {
  const month = new Date().getMonth();
  if (month >= 11 || month <= 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 7) return "summer";
  return "autumn";
}

interface Props {
  onNavigate: (path: string) => void;
  isLoggedIn: boolean;
}

export default function SeasonalPackages({ onNavigate, isLoggedIn }: Props) {
  const currentSeasonId = getCurrentSeasonId();
  const currentSeason = seasons.find((s) => s.id === currentSeasonId)!;
  const otherSeasons = seasons.filter((s) => s.id !== currentSeasonId);

  return (
    <section className="py-16 md:py-32 px-4 sm:px-8 bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16 md:mb-20">
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-6 block">
            Seasonal Packages
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-white/80 mb-4">
            Every season has its silence.
          </h2>
          <p className="text-white/40 text-base font-light max-w-xl mx-auto">
            Villars-sur-Ollon transforms with every season. We curate each one.
          </p>
        </div>

        {/* Teaser image visible to everyone */}
        <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] overflow-hidden mb-8 rounded-sm">
          <img
            src={currentSeason.image}
            alt={`${currentSeason.name} in Villars-sur-Ollon`}
            className="w-full h-full object-cover brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
            <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/80 bg-emerald-400/10 px-3 py-1 border border-emerald-400/20">
              Now in Season
            </span>
          </div>
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 block mb-2">
              {currentSeason.months}
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white/90">
              {currentSeason.name}
            </h3>
            <p className="text-white/50 font-light italic text-base sm:text-lg mt-2">
              {currentSeason.tagline}
            </p>
          </div>
        </div>

        {/* Gated content — activities + other seasons */}
        <MembershipGate
          title="Unlock seasonal packages."
          subtitle="Full activities, availability, and booking for every season are available to members."
        >
          {/* Current Season — Activities */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-12 pt-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-4 sm:mb-6 block">
                {currentSeason.name} Curated Activities
              </span>
              <div className="space-y-3 sm:space-y-4">
                {currentSeason.activities.map((activity) => (
                  <div key={activity} className="flex items-center gap-3">
                    <span className="w-1.5 h-1.5 bg-switz-red rounded-full shrink-0" />
                    <span className="text-white/70 text-sm">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-end mt-4 md:mt-0">
              <button
                onClick={() => onNavigate("/members")}
                className="w-full sm:w-auto px-10 py-4 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-switz-red hover:text-white transition-all duration-500"
              >
                Book This Season
              </button>
            </div>
          </div>

          {/* Other Seasons */}
          <div className="border-t border-white/5 pt-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-8 block">
              Also Available
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {otherSeasons.map((season) => (
                <Link
                  key={season.id}
                  to="/members"
                  className="group block"
                >
                  <div className="relative aspect-[16/10] overflow-hidden mb-4 rounded-sm">
                    <img
                      src={season.image}
                      alt={`${season.name} in Villars-sur-Ollon`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.6] saturate-[0.8]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 block mb-1">
                        {season.months}
                      </span>
                      <h4 className="font-serif text-xl text-white/80">{season.name}</h4>
                    </div>
                  </div>
                  <p className="text-white/40 text-sm font-light italic">{season.tagline}</p>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                    {season.activities.slice(0, 3).map((a) => (
                      <span key={a} className="text-[10px] text-white/30 uppercase tracking-widest">{a}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </MembershipGate>

      </div>
    </section>
  );
}
