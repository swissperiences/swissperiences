import { Link } from "react-router-dom";

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
    <section className="py-24 md:py-32 px-8 bg-[#0a0a0a] border-t border-white/5">
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

        {/* Current Season — Featured */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="relative aspect-[4/3] overflow-hidden group">
            <img
              src={currentSeason.image}
              alt={`${currentSeason.name} in Villars-sur-Ollon`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute top-6 left-6">
              <span className="text-[9px] uppercase tracking-[0.3em] text-emerald-400/80 bg-emerald-400/10 px-3 py-1 border border-emerald-400/20">
                Now in Season
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 mb-3 block">
              {currentSeason.months}
            </span>
            <h3 className="font-serif text-4xl md:text-5xl text-white/90 mb-3">
              {currentSeason.name}
            </h3>
            <p className="text-white/50 font-light italic text-lg mb-8">
              {currentSeason.tagline}
            </p>

            <div className="space-y-3 mb-10">
              {currentSeason.activities.map((activity) => (
                <div key={activity} className="flex items-center gap-3">
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-white/60 text-sm">{activity}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate(isLoggedIn ? "/members" : "/login")}
              className="self-start px-10 py-4 bg-white text-black text-[11px] uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-all duration-500"
            >
              {isLoggedIn ? "Book This Season" : "Request Your Stay"}
            </button>
          </div>
        </div>

        {/* Other Seasons */}
        <div className="grid md:grid-cols-3 gap-6">
          {otherSeasons.map((season) => (
            <Link
              key={season.id}
              to={isLoggedIn ? "/members" : "/login"}
              className="group block"
            >
              <div className="relative aspect-[16/10] overflow-hidden mb-4">
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
    </section>
  );
}
