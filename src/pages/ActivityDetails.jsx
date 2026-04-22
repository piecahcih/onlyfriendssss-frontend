import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, LocationIcon, CalendarIcon, ChatIcon } from "../icons";
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
  const joinActivity = useActivityStore((st) => st.joinActivity);
  const manageJoinRequest = useActivityStore((st) => st.manageJoinRequest);
  const storeUser = useUserStore((state) => state.user);

  const [loading, setLoading] = useState(true);
  const [loadingJoin, setLoadingJoin] = useState(false);

  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];

  const matchedCategory = categoryList.find((cat) => cat.id === currentActivity?.category)

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

  // const matchedCategory = categoryList.find((cat) => cat.id === currentActivity.category);
  // --- LOGIC การคำนวณสถานะ  ---
  const isHost = storeUser?.id === currentActivity.hostId;

  // 1. แยกรายการคนร่วมกิจกรรม (APPROVED) และ คนที่รออนุมัติ (PENDING)
  const approvedRequests = currentActivity.joinRequests?.filter(req => req.status === 'APPROVED') || [];
  const pendingRequests = currentActivity.joinRequests?.filter(req => req.status === 'PENDING') || [];

  // 2. คำนวณจำนวนและที่ว่าง
  const attendeesCount = approvedRequests.length;
  const maxParticipants = Number(currentActivity?.maxParticipants) || 0;
  const spotsLeft = maxParticipants - attendeesCount;
  const isFull = maxParticipants > 0 && spotsLeft <= 0;

  // 3. เช็คสถานะตัวเอง (User ที่กำลังดูหน้าจอ)
  const myRequest = currentActivity.joinRequests?.find(req => (req.userId || req.user?.id) === storeUser?.id);
  const isJoined = myRequest?.status === 'APPROVED';
  const isPending = myRequest?.status === 'PENDING';

  // 4. ฟังก์ชันช่วยจัดการ URL รูปภาพให้โชว์ติดทน
  const getFullImgPath = (path) => {
    if (!path) return defaultProfile;
    if (typeof path !== 'string' || path.startsWith('data:') || path.startsWith('http')) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  const hdlJoin = async () => {
    if (!storeUser) {
      alert("Please Log in first");
      return;
    }
    try {
      setLoadingJoin(true);
      const res = await joinActivity(actid); // ใช้ฟังก์ชันจาก Store

      if (res.data.data.status === "APPROVED") {
        alert("Joined successfully! 🎉");
      } else {
        alert("Request sent, waiting for host approval.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Cannot join this activity");
    } finally {
      setLoadingJoin(false);
    }
  };

  const hdlGotoChat = () => {
    navigate(`/chat/${encodeURIComponent(currentActivity.title)}`, {
      state: {
        roomId: currentActivity.id,
        title: currentActivity.title,
        icon: currentActivity.coverPhoto
      }
    })
  }

  // ฟังก์ชันสำหรับ Host จัดการคำขอ
  const hdlHostAction = async (requestId, status) => {
    try {
      await manageJoinRequest(actid, requestId, status);
      alert(`User ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`);
    } catch (error) {
      alert("Action failed");
    }
  };
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
            <span>{matchedCategory.icon}</span>
            {currentActivity?.category}
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
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-on-surface leading-tight">
            {currentActivity.title}
          </h1>

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
          {/* Description */}
          <p className="text-on-surface/80 leading-relaxed font-medium">
            {currentActivity.description || "No description provided."}
          </p>

          <p className="text-[11px] text-on-surface/30 font-light uppercase tracking-wider">
            Created {format(new Date(currentActivity.createdAt), 'dd MMM yyyy')}
          </p>
        </div>


        {/* Info Cards */}
        <div className="grid grid-cols-1 gap-4">
          {/* Time Card */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-[30px] shadow-sm border border-primary/5">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div className="flex items-center gap-6">
              <div>
                <h5 className="font-bold text-sm text-on-surface">
                  {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'eee, dd MMM yyyy') : '-'}
                </h5>
                <p className="text-xs text-on-surface/50 font-medium">
                  {currentActivity.eventStartTime ? format(new Date(currentActivity.eventStartTime), 'p') : '-'}
                </p>
              </div>
              {currentActivity.eventEndTime && (
                <>
                  <p>-</p>
                  <div>
                    <h5 className="font-bold text-sm text-on-surface">
                      {format(new Date(currentActivity.eventEndTime), 'eee, dd MMM yyyy')}
                    </h5>
                    <p className="text-xs text-on-surface/50 font-medium">
                      {format(new Date(currentActivity.eventEndTime), 'p')}
                    </p>
                  </div>
                </>
              )}
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

        {/* Participants Section */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-primary/5 space-y-6">
          {/* Header: Attendees Count */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-on-surface">
                {attendeesCount}/{maxParticipants > 0 ? maxParticipants : "∞"} Will go
              </span>
              <span className="text-sm font-bold text-primary">
                • {maxParticipants > 0 ? (spotsLeft > 0 ? `${spotsLeft} spots left` : "Full") : "Unlimited"}
              </span>
            </div>
            <button className="text-primary font-bold text-xs hover:underline transition-all">See All</button>
          </div>

          {/* List: Approved Attendees (UI วงกลมเรียงกัน) */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button className="shrink-0 w-12 h-12 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center text-primary text-2xl font-light hover:bg-primary/5 active:scale-95 transition-all">
              +
            </button>
            {approvedRequests.map((item, idx) => (
              <div key={idx} className="shrink-0 text-center space-y-1">
                <div className="relative">
                  <img
                    src={getFullImgPath(item.user?.profileImg)}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
                    alt="avatar"
                  />
                </div>
                <p className="text-[10px] font-bold text-on-surface/60 max-w-[48px] truncate">
                  {item.user?.username || "User"}
                </p>
              </div>
            ))}
            {attendeesCount === 0 && (
              <span className="text-[10px] font-bold text-on-surface/30 uppercase pl-2 italic">
                Be the first to join
              </span>
            )}
          </div>

          {/* ส่วนที่เพิ่ม: ถ้าเป็น Host ให้แสดงรายการ Pending เพื่อกดยอมรับ/ปฏิเสธ */}
          {isHost && pendingRequests.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[11px] font-black uppercase text-primary mb-3 tracking-widest">Wait for approval ({pendingRequests.length})</p>
              <div className="space-y-3">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-base-200/50 p-2 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <img src={getFullImgPath(req.user?.profileImg)} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs font-bold">{req.user?.username}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => hdlHostAction(req.id, 'REJECTED')} className="btn btn-ghost btn-xs text-error">Reject</button>
                      <button onClick={() => hdlHostAction(req.id, 'APPROVED')} className="btn btn-primary btn-xs text-white px-4 rounded-full">Approve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-linear-to-t from-base-200 via-base-200 to-transparent">
        <button
          // onClick={hdlJoin}
          // disabled={loadingJoin || isJoined || isFull || isPending || isHost}
          onClick={isJoined || isHost ? hdlGotoChat : hdlJoin}
          disabled={loadingJoin || isFull || isPending}
          className={`w-full max-w-2xl flex items-center justify-center gap-3 px-8 py-4 rounded-[25px] font-black text-xl  active:scale-95 transition-all border-b-4
          ${(isJoined || isHost)

              ? "bg-linear-to-r from-success to-secondary text-white"
              : (isFull || isPending)
                ? "bg-neutral text-white opacity-50 cursor-not-allowed"
                : "bg-linear-to-r from-primary to-secondary text-white border-primary-focus hover:scale-[1.05]"
            }`}
        >
          {/* {loadingJoin ? (
            <span className="loading loading-spinner"></span>
          ) : isHost ? (
            "YOU ARE THE HOST"
          ) : isJoined ? (
            <>
              <span className="text-2xl"><ChatIcon className="w-7" /></span> CHAT
            </>
          ) : isPending ? (
            "WAITING FOR APPROVAL..."
          ) : isFull ? (
            "ACTIVITY FULL"
          ) : (
            <>
              <span className="text-2xl">👋</span> JOIN NOW
            </>
          )} */}
          {loadingJoin ? (
            <span className="loading loading-spinner"></span>
          ) : (isJoined || isHost) ? (
            <>
              <span className="text-2xl"><ChatIcon className="w-7" /></span> {isHost ? "HOST CHAT" : "CHAT"}
            </>
          ) : isPending ? (
            "WAITING FOR APPROVAL..."
          ) : isFull ? (
            "ACTIVITY FULL"
          ) : (
            <>
              <span className="text-2xl">👋</span> JOIN NOW
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ActivityDetails;
