import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { useMapHandler } from "../hooks/useGeolocation";
import { useActivityMarkers } from "../hooks/useActivityMarkers";
import useActivityStore from "../stores/activitiesStore";
import useUserStore from "../stores/userStore";
import NotificationModal from "../components/NotificationModal";
import { SearchIcon, Notification, LocationIcon, CalendarIcon } from "../icons";

const BACKEND_URL = "http://localhost:3999";

const LDDiscover = () => {
  const navigate = useNavigate();
  const { mapContainerRef, mapRef, hdlGetCurrentLocation } = useMapHandler();

  const activities = useActivityStore((state) => state.activities) || [];
  const getAllCurrentActivities = useActivityStore(
    (state) => state.getAllCurrentActivities,
  );
  const getActivityByCategory = useActivityStore(
    (state) => state.getActivityByCategory,
  );
  const user = useUserStore((state) => state.user);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [notiOpen, setNotiOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryList = [
    { id: "all", title: "All", icon: "✨" },
    { id: "health", title: "Health", icon: "💪" },
    { id: "entertainment", title: "Relax", icon: "🎭" },
    { id: "art", title: "Art", icon: "🎨" },
    { id: "food", title: "Food", icon: "🍱" },
    { id: "travel", title: "Travel", icon: "✈️" },
  ];

  // 1. Fetch Data logic
  useEffect(() => {
    selectedCategory === "all"
      ? getAllCurrentActivities()
      : getActivityByCategory(selectedCategory);
  }, [selectedCategory, getAllCurrentActivities, getActivityByCategory]);

  // 2. Filter logic
  const filteredActivities = activities.filter(
    (act) =>
      act.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.place?.placeName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // 3. Using the Hook for Markers
  useActivityMarkers(mapRef, filteredActivities);

  const getFullImgPath = (path) => {
    if (!path)
      return "https://api.dicebear.com/8.x/avataaars/svg?seed=onlyfriends";
    if (
      typeof path !== "string" ||
      path.startsWith("data:") ||
      path.startsWith("http")
    )
      return path;
    return `${BACKEND_URL}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100 font-sans">
      <div
        ref={mapContainerRef}
        className="absolute inset-0 z-0 h-full w-full"
      />

      {/* UI Overlay Area */}
      <div className="absolute top-8 left-0 right-0 px-6 z-20 pointer-events-none">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex gap-3 pointer-events-auto">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/95 backdrop-blur-md rounded-full py-3.5 pl-14 pr-12 shadow-xl outline-none border-none ring-1 ring-black/5"
                placeholder="Find your vibe..."
              />
            </div>
            <button
              onClick={() => setNotiOpen(true)}
              className="bg-white/95 backdrop-blur-md p-4 rounded-full shadow-xl"
            >
              <Notification className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar pointer-events-auto">
            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg
                  ${selectedCategory === cat.id ? "bg-primary text-white scale-105" : "bg-white/95 backdrop-blur-md text-gray-600"}`}
              >
                <span>{cat.icon}</span> {cat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => hdlGetCurrentLocation(getFullImgPath(user?.profileImg))}
        className="absolute bottom-[260px] right-1 z-20 bg-white p-4 rounded-full shadow-2xl border-2 border-primary/20 active:scale-90 transition-all"
      >
        <LocationIcon className="w-7 h-7 text-primary" />
      </button>

      {/* Bottom Sheet UI */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50) setIsExpanded(true);
          else if (info.offset.y > 50) setIsExpanded(false);
        }}
        animate={{ y: isExpanded ? "-60vh" : "0vh" }}
        className="fixed inset-x-0 bottom-0 z-30 bg-white rounded-t-[40px] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto"
        style={{ height: "78vh", marginBottom: "-62vh" }}
      >
        <div
          className="w-full flex justify-center py-5 cursor-grab active:cursor-grabbing touch-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </div>
        <div className="px-8 pb-5 flex justify-between items-end border-b border-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">
              Discovery Activities
            </h2>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              {filteredActivities.length} Results
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32 space-y-4 bg-white">
          <AnimatePresence>
            {filteredActivities.map((act) => (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={act.id}
                onClick={() => navigate(`/activity-details?actid=${act.id}`)}
                className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-pointer active:scale-95 transition-transform"
              >
                <img
                  src={act.coverPhoto || "https://via.placeholder.com/150"}
                  className="w-20 h-20 rounded-xl object-cover shadow-sm"
                  alt="cover"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-1">
                    {act.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-2 font-medium">
                    <CalendarIcon className="w-3.5 text-primary" />
                    <span>
                      {act.eventStartTime
                        ? format(new Date(act.eventStartTime), "dd MMM • HH:mm")
                        : "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-1.5 font-medium">
                    <LocationIcon className="w-3.5 text-primary" />
                    <span className="line-clamp-1">
                      {act.place?.placeName || "Location N/A"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      <NotificationModal isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
    </div>
  );
};

export default LDDiscover;
