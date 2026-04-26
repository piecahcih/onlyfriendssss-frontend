import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { LeftIcon, StarIcon } from "../../icons";
import defaultProfile from "../../assets/default-profilepic.jpg";

function FriendReviews() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const reviews = state?.reviews || [];
  const title = state?.title || "Reviews";

  const BACKEND_URL = "http://localhost:3999";

  const getFullImgPath = (path) => {
    if (!path) return defaultProfile;
    if (typeof path !== "string" || path.startsWith("data:") || path.startsWith("http")) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex flex-col justify-between gap-5 px-6 py-4 relative">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[#a83100] hover:opacity-80 active:scale-95 transition-transform duration-200 relative z-10"
          >
            <LeftIcon className="w-8" />
          </button>
          <button className="text-2xl font-bold text-neutral">•••</button>
        </div>
        <div className="w-full flex items-center gap-4">
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-[22px] font-bold text-black">{title}</h2>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 overflow-y-auto px-6 pt-4 pb-8 flex flex-col gap-8"
      >
        <div className="flex flex-col gap-4">
          <h3 className="font-bold">Total Reviews ({reviews.length})</h3>

          {reviews.length > 0 ? (
            reviews.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <img
                      src={getFullImgPath(item.reviewer?.profileImg)}
                      className="w-10 h-10 rounded-full object-cover shadow-sm"
                      alt="reviewer"
                    />
                    <div>
                      <p className="font-bold text-sm text-gray-800">{item.reviewer?.firstName || item.reviewer?.username}</p>
                      <div className="flex items-center text-yellow-500 mt-0.5">
                        <StarIcon className="w-3.5 h-3.5 mr-1" />
                        <span className="text-xs font-bold">{item.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl">"{item.comment || "No comment provided"}"</p>
              </div>
            ))
          ) : (
            <div className="text-center py-10 opacity-50">No reviews found</div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default FriendReviews;
