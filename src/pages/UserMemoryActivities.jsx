import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LeftIcon } from "../icons";
import mockActImg from '../assets/mockActImg.jpg';

function UserMemoryActivities() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // รับข้อมูลจาก state ที่ส่งมาจาก MyActivityTab (ใช้คีย์ joinedActivities ตามที่ระบุใน onClick)
  const activities = state?.joinedActivities || [];
  const title = state?.title || "My Memory Activities";

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
      {/* Header: UI ทิศทางเดียวกันกับหน้าอื่นๆ */}
      <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex flex-col
      justify-between gap-5 px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#a83100] hover:opacity-80 active:scale-95 transition-transform duration-200 relative z-10" >
            <LeftIcon className="w-8" />
          </button>
          <button className="text-2xl font-bold text-neutral">•••</button>
        </div>
        <div className="w-full flex items-center gap-4 text-black">
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-[22px] font-bold">{title}</h2>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-white text-lg">Finished Activities ({activities.length})</h3>

          {activities.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {activities.map((activity, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/memory-activity-details?actid=${activity.id}`)}
                  className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col
      cursor-pointer hover:shadow-md transition-all active:scale-95"
                >
                  <div className="h-32 bg-gray-200">
                    <img
                      src={getFullImgPath(activity?.coverPhoto)}
                      className="w-full h-full object-cover"
                      alt="memory-activity"
                    />
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm line-clamp-2 text-neutral">{activity?.title || "Untitled"}</p>
                    <p className="text-[10px] text-primary mt-1 font-bold uppercase">{activity?.category ||
      "General"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-50 text-white">No memory activities found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default UserMemoryActivities;