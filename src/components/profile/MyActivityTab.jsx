import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useActivityStore from "../../stores/activitiesStore";
import { NavLink, useNavigate } from "react-router";
import { format } from "date-fns";
import defaultProfile from "../../assets/default-profilepic.jpg";
import { CalendarIcon, LocationIcon } from "../../icons";
// import Wishlist from "./Wishlist";
// import WishlistAll from "./WishlistAll";

function MyActivityTab() {
  const navigate = useNavigate();
  const tabs = ["Joined", "Created", "Memory"];
  const [activeTab, setActiveTab] = useState("Joined");

  const activities = useActivityStore((st) => st.activities);
  const getAllFinishedActivitiesOnThisAccount = useActivityStore(
    (st) => st.getAllFinishedActivitiesOnThisAccount,
  );
  const getAllActivitiesJoinedByThisAccount = useActivityStore(
    (st) => st.getAllActivitiesJoinedByThisAccount,
  );
  const getAllActivitiesCreatedByThisAccount = useActivityStore(
    (st) => st.getAllActivitiesCreatedByThisAccount,
  );

  useEffect(() => {
    // getAllActivitiesJoinedByThisAccount()
    const fetchActivities = {
      Joined: getAllActivitiesJoinedByThisAccount,
      Created: getAllActivitiesCreatedByThisAccount,
      Memory: getAllFinishedActivitiesOnThisAccount,
    };

    if (fetchActivities[activeTab]) {
      fetchActivities[activeTab]();
    }

    // console.log('selectedCategory:', selectedCategory)
    // console.log('activities', activities)
  }, [activeTab]);

  const hdlEdit = async (e, actid) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit-activity-details?actid=${actid}`);
  };

  return (
    <div className="">
      <div className="flex border-b border-gray-200 mb-2 relative p">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-md bai-jamjuree-bold transition-all relative z-10 ${activeTab === tab ? "text-primary" : "text-white"}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 mb-30 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Joined" && (
              <div className="space-y-4">
                {" "}
                {/* Container หลักของ Tab Joined */}
                {activities.length > 0 ? (
                  <div className="mb-4">
                    {/* --- Header: อยู่บรรทัดเดียวกันและคงที่ ไม่เลื่อนตามการ์ด --- */}
                    <div className="flex justify-between items-center py-2 mb-1">
                      <h3 className="font-bold text-lg text-white">
                        Joined Activities
                      </h3>
                      <button
                        onClick={() =>
                          navigate(`/joined-activities`, {
                            state: {
                              joinedActivities: activities,
                              title: `My Joined Activities`,
                            },
                          })
                        }
                        className="text-xs font-bold text-primary hover:underline transition-all"
                      >
                        See More &gt;
                      </button>
                    </div>

                    {/* --- Horizontal Scroll Area: โชว์แค่ 5 การ์ดแรก --- */}
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                      {activities.slice(0, 5).map((activity) => {
                        return (
                          <div
                            key={activity.id}
                            onClick={() =>
                              navigate(`/activity-details?actid=${activity.id}`)
                            }
                            className="min-w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="h-32 bg-gray-200">
                              <img
                                src={activity.coverPhoto}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 bg-white backdrop-blur-md">
                              <p className="font-light text-sm  text-black truncate">
                                {activity?.title || "Untitled"}
                              </p>
                              <p className="text-xs text-primary mt-1">
                                {activity?.category || "General"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">
                    {/* No events joined yet. */}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Created" && (
              <div className="space-y-4">
                {" "}
                {activities.length > 0 ? (
                  <div className="mb-4">
                    {/* --- Header: อยู่บรรทัดเดียวกันและคงที่ ไม่เลื่อนตามการ์ด --- */}
                    <div className="flex justify-between items-center py-2 mb-1">
                      <h3 className="font-bold text-lg text-white">
                        Created Activities
                      </h3>
                      <button
                        onClick={() =>
                          navigate(`/created-activities`, {
                            state: {
                              joinedActivities: activities,
                              title: `My Created Activities`,
                            },
                          })
                        }
                        className="text-xs font-bold text-primary hover:underline transition-all"
                      >
                        See More &gt;
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                      {activities.slice(0, 5).map((activity) => {
                        return (
                          <div
                            key={activity.id}
                            onClick={() =>
                              navigate(`/activity-details?actid=${activity.id}`)
                            }
                            className="min-w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          >
                            {/* <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300"> */}
                            <div className="h-32 bg-gray-200">
                              <img
                                src={activity.coverPhoto}
                                alt={activity.title}
                                className="w-full h-full object-cover "
                              />
                            </div>
                            <div className="p-3 bg-white backdrop-blur-md">
                              <p className="font-light text-sm  text-black truncate">
                                {activity?.title || "Untitled"}
                              </p>
                              <p className="text-xs text-primary mt-1">
                                {activity?.category || "General"}
                              </p>
                              <div className="flex items-center gap-1 px-2 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[12px] font-bold text-on-surface">
                                <button
                                  type="button"
                                  onClick={(e) => hdlEdit(e, activity.id)}
                                >
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium"></div>
                )}
              </div>
            )}

            {activeTab === "Memory" && (
              <div className="space-y-4">
                {" "}
                {activities.length > 0 ? (
                  <div className="mb-4">
                    {/* --- Header: อยู่บรรทัดเดียวกันและคงที่ ไม่เลื่อนตามการ์ด --- */}
                    <div className="flex justify-between items-center py-2 mb-1">
                      <h3 className="font-bold text-lg text-white">
                        Memory Activities
                      </h3>
                      <button
                        onClick={() =>
                          navigate(`/memory-activities`, {
                            state: {
                              joinedActivities: activities,
                              title: `My Memory Activities`,
                            },
                          })
                        }
                        className="text-xs font-bold text-primary hover:underline transition-all"
                      >
                        See More &gt;
                      </button>
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                      {activities.slice(0, 5).map((activity) => {
                        return (
                          <div
                            key={activity.id}
                            onClick={() =>
                              navigate(`/memory-activity-details?actid=${activity.id}`)}
                            className="min-w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          >
                            {/* <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300"> */}
                            <div className="h-32 bg-gray-200">
                              <img
                                src={activity.coverPhoto}
                                alt={activity.title}
                                className="w-full h-full object-cover "
                              />
                            </div>
                            <div className="p-3 bg-white backdrop-blur-md">
                              <p className="font-light text-sm  text-black truncate">
                                {activity?.title || "Untitled"}
                              </p>
                              <p className="text-xs text-primary mt-1">
                                {activity?.category || "General"}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">
                    {/* No events joined yet. */}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MyActivityTab;
