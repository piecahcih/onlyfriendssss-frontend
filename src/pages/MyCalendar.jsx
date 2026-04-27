import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../MyCalendar.css"; // เราจะสร้างไฟล์ CSS นี้แยกไว้
import useActivityStore from "../stores/activitiesStore";
import { format, isSameDay, parseISO } from "date-fns";
import { NavLink, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import mockActImg from '../assets/mockActImg.jpg';
import { LeftIcon } from "../icons";

function MyCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const activities = useActivityStore((st) => st.activities);
  console.log(activities);
  const getAllActivitiesJoinedByThisAccount = useActivityStore(
    (st) => st.getAllActivitiesJoinedByThisAccount,
  );

  useEffect(() => {
    getAllActivitiesJoinedByThisAccount();
  }, [getAllActivitiesJoinedByThisAccount]);

  // ฟังก์ชันช่วยจัดการวันที่ เพื่อป้องกันปัญหา Timezone หรือ Format ที่ผิดพลาด
  const safeParseDate = (dateStr) => {
    try {
      return parseISO(dateStr);
    } catch (e) {
      return new Date(dateStr);
    }
  };

  // แสดงจุดใต้เลขวันที่
  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const hasActivity = activities.some((act) =>
        isSameDay(safeParseDate(act.eventStartTime), date),
      );
      return hasActivity ? (
        <div className="flex justify-center mt-1">
          <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse"></div>
        </div>
      ) : null;
    }
  };

  const activitiesOnSelectedDate = activities.filter((act) =>
    isSameDay(safeParseDate(act.eventStartTime), selectedDate),
  );
  const getFullImgPath = (path) => {
      if (!path) return mockActImg;
      if (typeof path !== "string" || path.startsWith("data:") || path.startsWith("http")) {
        return path;
      }
      return `${BACKEND_URL}${path}`;
    };

    const hdlGoBack = () => {
    navigate(-1);
    // navigate(-1);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 pb-24">
      <header className="mb-8">
         <button
                  type="button"
                  onClick={hdlGoBack}
                  className="text-primary hover:opacity-80 active:scale-95 transition-all p-2 -ml-2"
                >
                  <LeftIcon className="w-8 h-8" />
                </button>
        <p className="text-gray-400 text-sm font-medium uppercase tracking-widest mb-1">
          Schedule
        </p>
        <h1 className="text-3xl font-black text-neutral">My Activities 🗓️</h1>
      </header>

      {/* Calendar Card */}
      <div className="bg-white p-2 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] mb-8 border border-gray-100">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          className="custom-calendar-style"
          next2Label={null}
          prev2Label={null}
          formatShortWeekday={(locale, date) => format(date, "eeeee")} // แสดงแค่ M, T, W
        />
      </div>

      {/* Activity List Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-end mb-4 px-2">
          <h3 className="font-bold text-neutral text-lg">
            {isSameDay(selectedDate, new Date())
              ? "Today"
              : format(selectedDate, "dd MMM")}
          </h3>
          <span className="text-xs text-gray-400 font-medium">
            {activitiesOnSelectedDate.length} Tasks
          </span>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {activitiesOnSelectedDate.length > 0 ? (
              activitiesOnSelectedDate.map((act, idx) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <NavLink to={`/activity-details?actid=${act.id}`}>
                    <div className="bg-white p-4 rounded-3xl flex items-center gap-4 shadow-sm border border-transparent hover:border-primary/20 active:scale-[0.98] transition-all group">
                     <div>
                         <img
                      src={getFullImgPath(act?.coverPhoto)}
                      className="w-14 h-14 rounded-2xl"
                      alt="activity"
                    />
                        {/* <span className="text-[10px] uppercase opacity-70">
                          {format(safeParseDate(act.eventStartTime), "aaa")}
                        </span> */}
                       
                     </div>

                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-bold text-neutral truncate group-hover:text-primary transition-colors">
                          {act.title}
                        </h4>
                        <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                          <span className="truncate">
                            {act.place?.placeName || "Online"}
                          </span>
                          
                        </div>
                         <span className="text-sm">
                          {format(safeParseDate(act.eventStartTime), "p")}
                        </span>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-[9px] font-black tracking-tighter uppercase ${
                          act.status === "APPROVED"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        }`}
                      >
                        {act.status}
                      </div>
                    </div>
                  </NavLink>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200"
              >
                <p className="text-3xl mb-2">🏖️</p>
                <p className="text-gray-400 font-medium">
                  No plans for this day.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MyCalendar;
