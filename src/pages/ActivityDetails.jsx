import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, LocationIcon, CalendarIcon } from "../icons";
import useActivityStore from "../stores/activitiesStore";
import useUserStore from "../stores/userStore"; 
import mainApi from "../api/mainApi"; 
import { format } from "date-fns";
import defaultProfile from "../assets/default-profilepic.jpg";

function ActivityDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const actid = searchParams.get("actid");

  // const activities = useActivityStore((st) => st.activities);
  const currentActivity = useActivityStore((st) => st.currentActivity);
  const getActivityById = useActivityStore((st) => st.getActivityById);
  const storeUser = useUserStore((state) => state.user); 
  
  const [loading, setLoading] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);

  useEffect(() => {
     if (actid) {
      console.log(currentActivity)
       const loadData = async () => {
         setLoading(true);
         await getActivityById(actid);
         setLoading(false);
       };
       loadData();
     }
   }, [actid, getActivityById]);

  const hdlGoBack = () => {
    navigate('/activities');
    // navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // ถ้าโหลดเสร็จแล้วแต่ไม่มีข้อมูล
       if (!currentActivity) {
         return (
           <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-6 text-center">
             <h2 className="text-2xl font-bold text-neutral-content mb-4">No activities found</h2>
             <button onClick={hdlGoBack} className="btn btn-primary rounded-full px-8 text-white">
               back to activities page
             </button>
           </div>
         );
       }

  // --- การคำนวณสถานะ "เต็ม" ---
      const maxParticipants = Number(currentActivity?.maxParticipants) || 0;
      const currentAttendees = Number(currentActivity?._count?.attendees) || 0;
      const spotsLeft = maxParticipants - currentAttendees;
    
      // จะถือว่าเต็มก็ต่อเมื่อมีการระบุจำนวนคนสูงสุดไว้ ( > 0) และจำนวนคนเข้าร่วมเท่ากับหรือมากกว่านั้น
     const isFull = maxParticipants > 0 && spotsLeft <= 0;
   
      // ตรวจสอบว่าผู้ใช้ปัจจุบันเข้าร่วมหรือยัง
      const isJoined = currentActivity.attendees?.some(
        (item) => (item.userId || item.user?.id) === storeUser?.id
      );
   
      const hdlJoin = async () => {
        if (!storeUser) {
          alert("Please Log in before join any activity");
          return;
        }
        try {
          setLoadingJoin(true);
          // เรียก API สำหรับ Join (ใช้ Instance mainApi โดยตรงตามเงื่อนไขห้ามแก้ไฟล์อื่น)
          await mainApi.post(`/activity/join/${actid}`);
   
          alert("Waiting to be approved");
   
          // ดึงข้อมูลกิจกรรมใหม่เพื่ออัปเดตรายชื่อผู้เข้าร่วมและจำนวนที่ว่าง
          await getActivityById(actid);
        } catch (error) {
          console.error("Join Error:", error);
          const errorMsg = error.response?.data?.message || "Activity Unavailable";
          alert(errorMsg);
        } finally {
          setLoadingJoin(false);
        }
      }

  return (
    <div className="min-h-screen bg-base-200 text-neutral pb-28">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-base-200/80 backdrop-blur-md flex items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={hdlGoBack}
          className="text-primary hover:opacity-80 active:scale-95 transition-all p-2 -ml-2"
        >
          <LeftIcon className="w-8 h-8" />
        </button>
        
             <button className="text-2xl font-bold text-neutral">•••</button>
        
      </header>

      <main className="max-w-2xl mx-auto px-6 space-y-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold">
                
                {currentActivity.isPublic ? " 🌎 Public  " : " 🔒 Private "}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm text-xs font-bold">
                <span className="text-lg">📍</span>
                1km
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary shadow-sm text-xs font-bold border border-primary/20">
                <span>{currentActivity.categoryIcon || "✨"}</span>
                 {currentActivity.category}
            </div>
        </div>
        {/* Cover Photo */}
        <div className="relative w-full h-40 rounded-[15px] overflow-hidden shadow-lg">
            <img 
                src={currentActivity.coverPhoto}
                alt={currentActivity.title}
                className="w-full h-full object-cover"
            />
        </div>

        

        {/* Title & Host */}
        <div className="space-y-4">
          <h1 className="text-3xl font-black text-on-surface leading-tight">
            {currentActivity.title}
          </h1>
          {/* <p className="text-on-surface/60 font-medium">{activity.place?.placeName}</p> */}

          <div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                   src={currentActivity.host?.profileImg || defaultProfile}
                   alt="host"
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                />
              </div>
              <div>
                <p className="text-[10px] text-on-surface/40 font-medium">HOSTED BY</p>
                <h4 className="font-bold text-sm">{currentActivity.host?.username}</h4>
              </div>
            </div>
           
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
            <p className="text-on-surface/80 leading-relaxed font-medium">
                {currentActivity.description || "No description provided."}
            </p>
            <p className="text-[11px] text-on-surface/30 font-bold uppercase tracking-wider pt-2">
                Created {format(new Date(currentActivity.createdAt || Date.now()), 'dd MMM yyyy')}
            </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4">
            {/* Time Card */}
            <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <CalendarIcon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                    <h5 className="font-bold text-sm text-on-surface">
                        {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'eee, dd MMM yyyy') : '-'}
                    </h5>
                    <p className="text-xs text-on-surface/50 font-medium">
                         {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'p') : '-'}
                    </p>
                </div>
            </div>

            {/* Location Card */}
            <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <LocationIcon className="w-7 h-7" />
                </div>
                <div className="flex-1 overflow-hidden">
                    <h5 className="font-bold text-sm text-on-surface truncate">
                        {currentActivity.place?.placeName}
                    </h5>
                    <p className="text-xs text-on-surface/50 font-medium truncate mb-1">
                        {currentActivity.place?.address || "See Map"}
                    </p>
                    <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentActivity.place?.placeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-[11px] font-bold hover:underline"
                    >
                        Open with Google Maps
                    </a>
                </div>
            </div>
        </div>

        {/* Participants */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-primary/5 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-on-surface">
                         {currentActivity._count?.attendees || 0}/{currentActivity.maxParticipants} Will go
                    </span>
                    <span className="text-sm font-bold text-primary">• {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}</span>
                </div>
                <button className="text-primary font-bold text-xs hover:underline transition-all">See All</button>
            </div>

            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                <button className="shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center text-primary text-2xl font-light hover:bg-primary/5 active:scale-95 transition-all">
                    +
                </button>
                 {currentActivity.attendees?.map((item, idx) => (
                    <div key={idx} className="shrink-0 text-center space-y-1">
                        <div className="relative">
                            <img 
                                src={item.user?.profileImg || defaultProfile} 
                                className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" 
                                alt="avatar" 
                            />
                        </div>
                        <p className="text-[10px] font-bold text-on-surface/60 max-w-[48px] truncate">
                            {item.user?.username}
                        </p>
                    </div>
                ))}
                {/* Fallback mock attendees if list is empty for UI testing */}
                {/* {(!activity.attendees || activity.attendees.length === 0) && [...Array(3)].map((_, i) => (
                    <div key={i} className="shrink-0 text-center space-y-1 opacity-50">
                        <img src={defaultProfile} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" alt="mock" />
                        <p className="text-[10px] font-bold text-on-surface/40">User {i+1}</p>
                    </div>
                ))} */}
            </div>
        </div>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-linear-to-t from-base-200 via-base-200 to-transparent">
        <button onClick={hdlJoin}
        disabled={loadingJoin || isJoined || isFull}
        className={`w-full max-w-2xl flex items-center justify-center gap-3 px-8 py-4 rounded-[25px] font-black text-xl  active:scale-95 transition-all border-b-4
          ${isJoined
              ? "bg-success text-white border-success-content cursor-default opacity-90 shadow-none"
              : isFull
                  ? "bg-neutral text-white border-neutral-content opacity-50 cursor-not-allowed"
                  : "bg-primary text-white border-primary-focus hover:shadow-[0_12px_32px_rgba(252,81,0,0.4)] hover:-translate-y-0.5"
          }`}
      >
        {loadingJoin ? (
          <span className="loading loading-spinner"></span>
        ) : isJoined ? (
          <>
            <span className="text-2xl">✔</span> Joined
         </>
        ) : isFull ? (
          "Full"
        ) : (
          <>
            <span className="text-2xl">👋</span> JOIN
          </>
        )}
        </button>
      </div>
    </div>
  );
}

export default ActivityDetails;
