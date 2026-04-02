import { useState, useCallback, useRef } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/mapbox";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { City } from "@/data/cities";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const INITIAL_VIEW = {
  latitude: 46.8,
  longitude: 8.2,
  zoom: 7.5,
  pitch: 0,
  bearing: 0,
};

const MAX_BOUNDS: [[number, number], [number, number]] = [
  [5.5, 45.5],
  [11.0, 48.0],
];

interface Props {
  cities: City[];
  isMember?: boolean;
}

function CityMarkerIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-transform duration-250"
      style={{ transform: isActive ? "scale(1.3)" : "scale(1)" }}
    >
      <circle
        cx="10"
        cy="10"
        r="5"
        fill={isActive ? "#D8B58A" : "#2E9090"}
        fillOpacity={isActive ? 1 : 0.85}
      />
      <circle
        cx="10"
        cy="10"
        r="9"
        stroke={isActive ? "#D8B58A" : "#2E9090"}
        strokeWidth="1.5"
        strokeOpacity={isActive ? 0.5 : 0.3}
        fill="none"
      />
      {isActive && (
        <circle
          cx="10"
          cy="10"
          r="9"
          fill={isActive ? "#D8B58A" : "#2E9090"}
          fillOpacity={0.15}
        />
      )}
    </svg>
  );
}

export default function SwitzerlandMap({ cities, isMember = false }: Props) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const handleMarkerClick = useCallback(
    (city: City) => {
      setSelectedCity(city);
      mapRef.current?.flyTo({
        center: [city.lng, city.lat],
        zoom: Math.max(viewState.zoom, 9),
        duration: 800,
      });
    },
    [viewState.zoom]
  );

  const handleMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  if (!MAPBOX_TOKEN) return null;

  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-12"
        >
          <span className="text-switz-red text-xs font-bold tracking-[0.4em] uppercase mb-4 block">
            The Map
          </span>
          <h2 className="text-3xl md:text-4xl font-serif">
            Explore Switzerland
          </h2>
        </motion.div>

        {/* Map container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
          className="w-full h-[50vh] md:h-[60vh] lg:h-[65vh] max-h-[700px] rounded-sm overflow-hidden border border-white/5"
        >
          <Map
            ref={mapRef}
            {...viewState}
            onMove={handleMove}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v11"
            maxBounds={MAX_BOUNDS}
            minZoom={6.5}
            maxZoom={12}
            dragRotate={false}
            touchPitch={false}
            attributionControl={false}
            reuseMaps
          >
            <NavigationControl
              position="bottom-right"
              showCompass={false}
            />

            {cities.map((city) => (
              <Marker
                key={city.slug}
                latitude={city.lat}
                longitude={city.lng}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  handleMarkerClick(city);
                }}
                style={{ cursor: "pointer" }}
              >
                <div
                  className="group relative"
                  aria-label={city.name}
                >
                  <CityMarkerIcon
                    isActive={selectedCity?.slug === city.slug}
                  />
                  {/* City name label */}
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 -top-7 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-medium transition-opacity duration-300 ${
                      selectedCity?.slug === city.slug
                        ? "text-white/90 opacity-100"
                        : "text-white/50 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {city.name}
                  </span>
                </div>
              </Marker>
            ))}

            {selectedCity && (
              <Popup
                latitude={selectedCity.lat}
                longitude={selectedCity.lng}
                anchor="bottom"
                offset={20}
                closeOnClick={false}
                onClose={() => setSelectedCity(null)}
                maxWidth="280px"
              >
                <div className="p-5">
                  <span className="text-[9px] text-white/40 uppercase tracking-[0.3em] block mb-1">
                    {selectedCity.region}
                  </span>
                  <h3
                    className="text-lg text-white mb-1"
                    style={{ fontFamily: "var(--ds-font-display)" }}
                  >
                    {selectedCity.name}
                  </h3>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest mb-3">
                    {selectedCity.elevation} · {selectedCity.canton}
                  </p>
                  {isMember ? (
                    <>
                      <p
                        className="text-white/55 text-sm italic leading-relaxed mb-4"
                        style={{ fontFamily: "var(--ds-font-display)" }}
                      >
                        "{selectedCity.tagline}"
                      </p>
                      <Link
                        to={`/destinations/${selectedCity.slug}`}
                        className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-white/80 hover:text-white transition-colors"
                      >
                        Explore <ArrowRight size={12} />
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/request-access"
                      className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-bold text-white/40 hover:text-white/70 transition-colors"
                    >
                      Members only <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </motion.div>
      </div>
    </section>
  );
}
