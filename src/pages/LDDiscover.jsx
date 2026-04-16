import { useState } from "react";
import { MicIcon, Notification, SearchIcon } from "../icons";
import NotificationModal from "../components/NotificationModal";
import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

function LDDiscover() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaWFtYmVuIiwiYSI6ImNtbzBmaWFhZTA3cmsyeW85eHhpOXQxdGcifQ.HOpVteb2fW2U-gN61K0_ew";
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [100.53499383276497, 13.758571505785834],
      zoom: 15,
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryList = [
    { id: "all", title: "All", icon: "✨" },
    { id: "health", title: "Health & Wellness", icon: "💪" },
    { id: "entertainment", title: "Chill & Hangout", icon: "🎭" },
    { id: "art", title: "Creative", icon: "🎨" },
    { id: "food", title: "Foodies", icon: "🍱" },
    { id: "travel", title: "Travel", icon: "✈️" },
  ];

  const [notiOpen, setNotiOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-base-200">
      <div
        id="map-container"
        ref={mapContainerRef}
        className="absolute inset-0 z-0"
        style={{ width: "100%", height: "100%" }}
      />

      <main className="absolute inset-0 z-10 pt-8 px-6 pointer-events-none">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Search Bar Section */}
          <div className="flex items-center justify-between gap-3 pointer-events-auto">
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <SearchIcon className="w-5 text-on-surface/40" />
              </div>
              <input
                className="w-full bg-white/90 backdrop-blur-md border-none outline-none ring-2 ring-[#e09c99]/20 focus:ring-primary py-3 pl-14 pr-14 rounded-full font-body text-lg shadow-xl transition-all placeholder:text-on-surface/40"
                placeholder="Find your vibe..."
                type="text"
              />
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <MicIcon className="w-6 text-on-surface/40" />
              </div>
            </div>

            <button
              onClick={() => setNotiOpen(true)}
              className="relative p-4 rounded-full bg-white/90 backdrop-blur-md ring-2 ring-[#e09c99]/20 shadow-xl active:scale-95 transition-all"
            >
              <Notification className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-5 h-5 bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white rounded-full">
                1
              </span>
            </button>
          </div>

          {/* Categories Section */}
          <section className="pointer-events-auto">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 no-scrollbar">
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-5 py-2 rounded-3xl font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg
                                      ${
                                        selectedCategory === cat.id
                                          ? "bg-primary text-white"
                                          : "bg-white/90 backdrop-blur-md text-on-surface/60 hover:bg-white"
                                      }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.title}
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>

      <NotificationModal isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
    </div>
  );
}

export default LDDiscover;
