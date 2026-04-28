import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LeftIcon } from "../../icons";
import mockActImg from '../../assets/mockPlaceImg.jpg';

function UserJoinedActivities() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // รับข้อมูลจาก state ที่ส่งมาจาก MyActivityTab
  // MyActivityTab ส่ง profileData.joinRequests มาในชื่อ joinedActivities
  const activities = state?.joinedActivities || [];
  const title = state?.title || "My Joined Activities";

  const BACKEND_URL = "http://localhost:3999";

  const getFullImgPath = (path) => {
    if (!path) return mockActImg;
    if (typeof path !== "string" || path.startsWith("data:") || path.startsWith("http")) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-secondary hover:opacity-80  active:scale-95 transition-transform duration-200 relative z-10"
        >
          <LeftIcon className="w-8" />
        </button>

        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
          {title}
        </h1>

        <div className="w-8"></div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-8 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">Activities ({activities.length})</h3>

          {activities.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {activities.map((item, idx) => {
                // MyActivityTab ส่ง profileData.joinRequests ซึ่งแต่ละอันจะมี .activity ข้างใน
                const activity = item.activity || item;
                return (
                  <div
                    key={idx}
                    onClick={() => navigate(`/activity-details?actid=${activity.id}`)}
                    className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm flex
          flex-col cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="h-32 bg-gray-200">
                      <img
                        src={getFullImgPath(activity?.coverPhoto)}
                        className="w-full h-full object-cover"
                        alt="activity"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-sm line-clamp-2">{activity?.title || "Untitled"}</p>
                      <p className="text-xs text-primary mt-1">{activity?.category || "General"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 opacity-50">No activities found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserJoinedActivities;