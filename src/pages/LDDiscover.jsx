import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { NavLink, useNavigate } from "react-router";
import "mapbox-gl/dist/mapbox-gl.css";
import { format } from "date-fns";
import { useMapHandler } from "../hooks/useGeolocation";
import { useActivityMarkers } from "../hooks/useActivityMarkers";
import useActivityStore from "../stores/activitiesStore";
import useUserStore from "../stores/userStore";
import NotificationModal from "../components/NotificationModal";
import { SearchIcon, Notification, CalendarIcon, YourLocationIcon, MicIcon, LocationIcon, RighttIcon, } from "../icons";
import PremiumModal from "../components/ads/PremiumModal"
import useNotificationStore from '../stores/notificationStore'
import { io, Socket } from 'socket.io-client'
import Wishlist from "../components/profile/Wishlist";
import { useSpeechToText } from "../hooks/useSpeechToText";


const BACKEND_URL = "http://localhost:3999";

const LDDiscover = () => {
  const navigate = useNavigate();
  const { mapContainerRef, mapRef, hdlGetCurrentLocation } = useMapHandler();
  const { unreadCount } = useNotificationStore()



  const activities = useActivityStore((state) => state.activities) || [];
  const getAllCurrentActivities = useActivityStore(
    (state) => state.getAllCurrentActivities,
  );
  const getActivityByCategory = useActivityStore(
    (state) => state.getActivityByCategory,
  );
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token)

  const [selectedCategory, setSelectedCategory] = useState("all");
  const categoryList = [
    { id: "all", title: "All", icon: "✨" },
    { id: "health", title: "Health & Wellness", icon: "💪" },
    { id: "entertainment", title: "Chill & Hangout", icon: "🎭" },
    { id: "art", title: "Creative", icon: "🎨" },
    { id: "food", title: "Foodies", icon: "🍱" },
    { id: "travel", title: "Travel", icon: "✈️" },
  ];
  // const [isExpanded, setIsExpanded] = useState(false);
  const [step, setStep] = useState("half");
  const y = useMotionValue(0);
  const yPosition = step === "half" ? "0%" : "-60vh";


  const buttonOpacity = useTransform(y, [-200, -300], [1, 0]);

  const [searchText, setSearchText] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  // const socketRef = useRef(null)
  const [settingForm, setSettingForm] = useState(false)
  const socketRef = useRef(null)

  useEffect(() => {
    selectedCategory === "all"
      ? getAllCurrentActivities()
      : getActivityByCategory(selectedCategory);
    // console.log("selectedCategory:", selectedCategory);
    // console.log("activities", activities);
  }, [selectedCategory]);

  useEffect(() => {
    if (hdlGetCurrentLocation && user) {
      hdlGetCurrentLocation(getFullImgPath(user?.profileImg), true);
    }
  }, [hdlGetCurrentLocation, user?.profileImg]);


  const connectSocket = () => {
    console.log('tokenkub', token)
    socketRef.current = io("http://localhost:3999", {
      auth: { token }
    })
    socketRef.current.on("connect", () => {
      console.log('Connected', socketRef.current.id)
    })
    return () => {
      socketRef.current.disconnect()
    }
  }
  useEffect(() => {
    if (hdlGetCurrentLocation) {
      hdlGetCurrentLocation(getFullImgPath(user?.profileImg))
    }
  }, [hdlGetCurrentLocation, user?.profileImg])


  const activitySuggestions = Array.isArray(activities)
    ? activities
      .filter((act) =>
        act.title.toLowerCase().includes(searchText.toLowerCase()),
      )
      .slice(0, 3)
    : [];

  const location = [...new Set(activities.map((act) => act.place?.placeName))];

  const locationSuggestions = Array.isArray(activities)
    ? location
      .filter((placeName) =>
        placeName?.toLowerCase().includes(searchText.toLowerCase()),
      )
      .slice(0, 3)
    : [];

  // Filter logic
  const filteredActivities = (
    Array.isArray(activities)
      ? selectedCategory === "all"
        ? activities
        : activities.filter(
          (act) =>
            act.category?.toLowerCase() === selectedCategory.toLowerCase(),
        )
      : []
  ).filter(
    (act) =>
      act.title.toLowerCase().includes(searchText.toLowerCase()) ||
      act.place?.placeName?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const [notiOpen, setNotiOpen] = useState(false);

  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchText(transcript);
    setSuggestOpen(true);
  });


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

      <div className="absolute top-8 left-0 right-0 px-6 z-40 ">
        <div className="mx-auto">
          {/* Search Bar Section */}
          <div className="flex items-center justify-between gap-2 pointer-events-auto">
            <div className="relative flex-1">
              {" "}
              {/* ตัวนี้ทำหน้าที่เป็นจุดยึด (Anchor) ให้ Modal */}
              <div className="absolute inset-y-0 left-5 z-10 flex items-center pointer-events-none">
                <SearchIcon className="w-5 text-neutral" />
              </div>
              <input
                className="w-full bg-white/95 backdrop-blur-md border-none outline-none ring-2 ring-primary/10 focus:ring-primary py-2 pl-14 pr-14 rounded-full shadow-xl text-gray-700 transition-all placeholder:text-gray-400"
                placeholder="Find your vibe..."
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={() => setSuggestOpen(true)}
                onBlur={() => setTimeout(() => setSuggestOpen(false), 200)}
              />
              {isSupported && (
                <div
                  className="absolute inset-y-0 right-5 flex items-center z-10 cursor-pointer"
                  onClick={toggleListening}
                >
                  <MicIcon
                    className={`w-6 transition-all duration-300 ${isListening ? "text-red-500 animate-pulse scale-110" : "text-gray-400 hover:text-primary"
                      }`}
                  />
                </div>
              )}

              {/* Suggestions Modal - แสดงเมื่อมีการพิมพ์และเจอผลลัพธ์ */}
              {suggestOpen &&
                searchText.length > 0 &&
                activitySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[30px] shadow-2xl z-50 overflow-hidden border border-primary/5 max-h-[400px] overflow-y-auto">
                    <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5">
                      Activities
                    </div>
                    {activitySuggestions.map((act) => (
                      <div
                        key={`act-${act.id}`}
                        onClick={() => {
                          setSearchText(act.title);
                          setSuggestOpen(false);
                          mapRef.current?.flyTo({
                            center: [act.place?.longitude, act.place?.latitude],
                            zoom: 16,
                          });
                        }}
                        className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-bold text-sm">
                            {act.title}
                          </span>
                          <span className="text-[9px] text-gray-400 uppercase font-black">
                            {act.category}
                          </span>
                        </div>
                      </div>
                    ))}
                    {locationSuggestions.length > 0 && (
                      <>
                        <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5 border-t border-gray-50">
                          Locations
                        </div>
                        {locationSuggestions.map((placeName) => (
                          <div
                            key={`loc-${placeName.id}`}
                            onClick={() => {
                              setSearchText(placeName);
                              setSuggestOpen(false);
                            }}
                            className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-none transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-on-surface font-bold text-sm">
                                {placeName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
            </div>

            {/* ปุ่ม Notification */}
            <button
              type="button"
              onClick={() => setNotiOpen(true)}
              className="relative p-3 rounded-full bg-white/95 backdrop-blur-md shadow-xl active:scale-95 transition-all"
            >
              <Notification className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (  // แก้จาก hardcode 1
                <span className="absolute top-2 right-2 w-5 h-5 bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>


          </div>
          {/* Categories Horizontal Scroll */}
          <section className="space-y-4 my-2 z-50 -mr-6">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth -mx-2 px-2">
              {categoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                  }}
                  className={`shrink-0 px-4 py-1 rounded-3xl font-medium text-[12px] flex items-center gap-2 transition-all duration-300 active:scale-95
                                    ${selectedCategory === cat.id
                      ? "bg-primary text-white shadow-[0_8px_12px_rgba(252,81,0,0.3)]"
                      : "bg-white text-on-surface/60 hover:bg-white/80 shadow-sm"
                    }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  {cat.title}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>



      {/* Bottom Sheet UI */}
      <motion.div
        initial={false}
        animate={{ y: yPosition }}
        style={{ y, height: "106vh", marginBottom: "-62vh" }}
        onUpdate={(latest) => {
          // Sync motion value during animation
          if (typeof latest.y === "number") y.set(latest.y);
          else if (typeof latest.y === "string" && latest.y.endsWith("vh")) {
            const vh = parseFloat(latest.y);
            y.set((vh / 100) * window.innerHeight);
          } else if (latest.y === "0%") {
            y.set(0);
          }
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        drag="y"
        dragConstraints={{ top: -800, bottom: 0 }}
        dragElastic={0.05}
        onDrag={(event, info) => {
          // Live update y motion value during drag
          y.set(info.offset.y);
        }}
        onDragEnd={(_, info) => {
          const { y: offsetY } = info.offset;
          const { y: velocityY } = info.velocity;
          const pointY = info.point.y;

          // pointY is the absolute position on screen. 
          // If pointY is small (e.g., < 150), it means the sheet is near the top.
          const isAtTop = pointY < 150;

          if (step === "half") {
            if (offsetY < -150 || velocityY < -500 || isAtTop) {
              setStep("high");
              // Smooth transition to activities
              setTimeout(() => navigate("/activities-list"), 200);
            } else if (offsetY < -50 || velocityY < -300) {
              setStep("high");
            }
          } else if (step === "high") {
            if (offsetY > 100 || velocityY > 400) {
              setStep("half");
            } else if (offsetY < 0 || velocityY < -200 || isAtTop) {
              // Already at top, any upward intent navigates
              navigate("/activities-list");
            }
          }
        }}
        className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-[25px] shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col pointer-events-auto"
      >

        {/* Location Pin - Moved inside and positioned at top-right of sheet */}
        <motion.div
          style={{ opacity: buttonOpacity }}
          className="absolute -top-16 right-6"
        >
          <button
            onClick={() => hdlGetCurrentLocation(getFullImgPath(user?.profileImg))}
            className="p-3 bg-white rounded-full shadow-xl hover:bg-gray-50 active:scale-95 transition-all border border-gray-100 group"
            title="Go to current location"
          >
            <YourLocationIcon className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
          </button>
        </motion.div>


        <div className="w-full flex justify-center py-5 cursor-grab active:cursor-grabbing touch-pan-y"
          onClick={() => setStep(step === "half" ? "high" : "half")}>
          <div className="w-12 h-1.5 bg-gray-200 rounded-full -mt-2 " />
        </div>

        <div className="px-6 flex justify-between items-end border-b border-gray-50 -mt-1">
          <div>
            <h2 className="text-[18px] font-bold text-gray-800 tracking-tight">
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
                className="flex gap-4 cursor-pointer active:scale-95 transition-transform"
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
                    <YourLocationIcon className="w-3.5 text-primary" />
                    <span className="line-clamp-1">
                      {act.place?.placeName || "Location N/A"}
                    </span>
                  </div>
                </div>

                <RighttIcon className="w-7" />

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
