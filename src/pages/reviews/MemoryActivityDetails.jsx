import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { LeftIcon, LocationIcon, CalendarIcon, ChatIcon } from "../../icons";
import useActivityStore from "../../stores/activitiesStore";
import useUserStore from "../../stores/userStore";
import mainApi from "../../api/mainApi";
import { format } from "date-fns";
import defaultProfile from "../../assets/default-profilepic.jpg";

function MemoryActivityDetails() {
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
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const BACKEND_URL = "http://localhost:3999";

  const categoryList = [
    { id: "HEALTH", title: "Health & Wellness", icon: "💪" },
    { id: "ENTERTAINMENT", title: "Chill & Hangout", icon: "🎭" },
    { id: "ART", title: "Creative", icon: "🎨" },
    { id: "FOOD", title: "Foodies", icon: "🍱" },
    { id: "TRAVEL", title: "Travel", icon: "✈️" },
  ];

  // const matchedCategory = categoryList.find((cat) => cat.id === currentActivity.category)

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

  const matchedCategory = categoryList.find((cat) => cat.id === currentActivity.category);
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

  const hdlActivityReview = () => {
    navigate(`/reviews-activities?actid=${actid}`);
  };
  const hdlPeerReview = () => {
    console.log("Checking data before navigate:", selectedParticipant);
    console.log('selectedParticipant', selectedParticipant)
    if (selectedParticipant && selectedParticipant.userId) {
      navigate(`/reviews-peer?actid=${actid}&userId=${selectedParticipant.userId}`);
    } else {
      alert("Please select a participant first");
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
                {attendeesCount} That Joined
              </span>
            </div>
          </div>

          {/* List: Approved Attendees (UI วงกลมเรียงกัน) */}
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">

            {approvedRequests.map((item, idx) => (
              <div
                key={idx}
                className="shrink-0 text-center space-y-1 cursor-pointer active:scale-95 transition-all"
                onClick={() => {
                  console.log("You clicked on:", item); // เช็คว่า item นี้มี id และ user หรือไม่
                  setSelectedParticipant(item);
                }}
              >
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
                No one join
              </span>
            )}
          </div>

          {/* Modal: Participant Details */}
          {selectedParticipant && (
            <div className="modal modal-open">
              <div className="modal-box bg-white rounded-[35px] p-8 flex flex-col items-center gap-5 relative">
                <button
                  onClick={() => setSelectedParticipant(null)}
                  className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4">
                  ✕
                </button>

                <div className="relative">
                  <img
                    src={getFullImgPath(selectedParticipant.user?.profileImg)}
                    className="w-28 h-28 rounded-full border-4 border-primary/10 object-cover shadow-lg"
                    alt="participant"
                  />
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-black text-on-surface">
                    {selectedParticipant.user?.username || "User"}
                  </h3>
                  <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">Participant</p>
                </div>

                <div className="w-full space-y-3 mt-2">
                  <button className="btn btn-primary w-full rounded-2xl text-white font-bold">
                    Go the Profile
                  </button>
                  <button
                    onClick={hdlPeerReview}
                    className="btn btn-outline btn-primary w-full rounded-2xl font-bold">
                    Review This User
                  </button>
                </div>
              </div>
              <div className="modal-backdrop" onClick={() => setSelectedParticipant(null)}>
                <button>close</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 w-full p-6 z-40 bg-linear-to-t from-base-200 via-base-200 to-transparent">
        <button
          onClick={hdlActivityReview}
          className={`w-full max-w-2xl flex bg-primary items-center justify-center gap-3 px-8 py-4 rounded-[25px] font-black text-xl text-white active:scale-95 transition-all border-b-4`}>

          <span className="text-2xl">👋</span> Review This Activity
        </button>
      </div>
    </div>
  );
}

export default MemoryActivityDetails;
