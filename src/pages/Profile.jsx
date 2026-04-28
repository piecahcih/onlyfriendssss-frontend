import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import ProfilePic from "../components/profile/ProfilePic";
import useUserStore from "../stores/userStore";
import {
  SettingIcon,
  CloseIcon,
  CameraIcon,
  EditIcon,
  CalendarIcon,
} from "../icons";
import { NavLink, useNavigate } from "react-router";

import MyActivityTab from "../components/profile/MyActivityTab";
import useReviewStore from "../stores/reviewStore";
import { editProfileApi } from "../api/mainApi";
import "../../MyCalendar.css";
import useActivityStore from "../stores/activitiesStore";

const BACKEND_URL = "http://localhost:3999";

const interests = [
  // Food & Drink
  { label: "foodie 🍳", value: "foodie" },
  { label: "cafe hopping ☕", value: "cafe_hopping" },
  { label: "street food 🍢", value: "street_food" },
  { label: "fine dining 🍷", value: "fine_dining" },
  { label: "cooking & baking 👩‍🍳", value: "cooking_baking" },
  { label: "drinks & nightout 🍻", value: "drinks_nightout" },

  // Health & Active
  { label: "slowlife 🌿", value: "slowlife" },
  { label: "health 🥗", value: "health" },
  { label: "sport 🏀", value: "sport" },
  { label: "camping 🏕️", value: "camping" },
  { label: "gym & workout 💪", value: "gym_workout" },
  { label: "yoga & pilates 🧘‍♀️", value: "yoga_pilates" },
  { label: "running 🏃", value: "running" },
  { label: "mental wellness 😌", value: "mental_wellness" },
  { label: "team sports ⚽", value: "team_sports" },

  // Art & Culture
  { label: "art 🎨", value: "art" },
  { label: "museum & gallery 🏛️", value: "museum_gallery" },
  { label: "photography 📸", value: "photography" },
  { label: "crafting & DIY ✂️", value: "crafting_diy" },
  { label: "live music 🎸", value: "live_music" },
  { label: "book club 📚", value: "book_club" },

  // Entertainment & Fun
  { label: "gaming 🎮", value: "gaming" },
  { label: "movies & cinema 🍿", value: "movies_cinema" },
  { label: "board games 🎲", value: "board_games" },
  { label: "video games 🕹️", value: "video_games" },
  { label: "karaoke 🎤", value: "karaoke" },
  { label: "concerts & festivals 🎪", value: "concerts_festivals" },

  // Travel & Adventure
  { label: "travel ✈️", value: "travel" },
  { label: "volunteer 🤝", value: "volunteer" },
  { label: "backpacking 🎒", value: "backpacking" },
  { label: "road trip 🚗", value: "road_trip" },
  { label: "beach vibes 🏖️", value: "beach_vibes" },
  { label: "hiking & trekking 🥾", value: "hiking_trekking" },
  { label: "sightseeing 🗺️", value: "sightseeing" },
];

const Profile = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);
  const getProfile = useUserStore((state) => state.getProfile);
  const updateProfile = useUserStore((state) => state.updateProfile);
  const deleteProfile = useUserStore((state) => state.deleteProfile);

  const getUserInterest = useUserStore((state) => state.getUserInterest);
  const interestsFromStore = useUserStore((state) => state.interests);

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [settingForm, setSettingForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const userRatings = useReviewStore((state) => state.userRatings);
  const getUserRatings = useReviewStore((state) => state.getUserRatings);

  const activities = useActivityStore((state) => state.activities);

  const [step, setStep] = useState("half");
  const y = useMotionValue(0);

  const yPosition = step === "half" ? "50vh" : "5vh";
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
    getUserRatings();
    getUserInterest();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      const data =
        response.data.user?.data || response.data.user || response.data;
      setProfileData(data);
      setEditForm(data);
      setUser(data);
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    }
  };

  const handleEditOpen = () => {
    setEditForm({ ...profileData });
    setPreviewImage(null);
    setIsEditing(true);
  };

  const handleSettingOpen = () => setSettingForm(true);

  const hdlLogout = () => {
    sessionStorage.removeItem("hasSeenPremium");
    logout();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", editForm.username || "");
      formData.append("firstName", editForm.firstName || "");
      formData.append("lastName", editForm.lastName || "");
      formData.append("gender", editForm.gender || "MALE");
      formData.append("bio", editForm.bio || "");

      if (editForm.profileImg instanceof File) {
        formData.append("profileImg", editForm.profileImg);
      }

      const response = await editProfileApi(formData);
      const updatedUser = response.data.data;

      if (updatedUser.profileImg) {
        updatedUser.profileImg = `${updatedUser.profileImg}?t=${Date.now()}`;
      }
      setProfileData(updatedUser);
      setUser(updatedUser);

      fetchUserProfile();
      setIsEditing(false);
      setPreviewImage(null);
      alert("Data Saved Success!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size is too large (limit 2MB)");
        return;
      }
      setEditForm((prev) => ({ ...prev, profileImg: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const hdlDeleteAccount = async () => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชี?")) {
      try {
        await deleteProfile();
        alert("ลบบัญชีเรียบร้อยแล้ว");
        logout();
        navigate("/");
      } catch (error) {
        alert(error.response?.data?.message || "ไม่สามารถลบบัญชีได้");
      }
    }
  };

  const triggerFileInput = () => fileInputRef.current.click();

  const getFullImgPath = (path) => {
    if (!path) return null;
    if (typeof path !== "string" || path.startsWith("data:")) return path;
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  if (!profileData)
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  const currentRatingInfo = userRatings.find((u) => u.id === profileData?.id);
  const averageScore = currentRatingInfo?.averageRating || "0.0";

  return (
    <div className="min-h-screen bg-black/80 font-sans relative overflow-hidden">
      {/* --- BACKGROUND IMAGE --- */}
      <div className="relative w-full h-[65vh]">
        <img
          src={getFullImgPath(profileData?.profileImg)}
          className="w-full h-full pb-10 object-cover scale-110"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      </div>

      {/* --- TOP ACTIONS --- */}
      <div className="fixed top-6 right-6 flex gap-1 z-50">
        <button
          onClick={handleEditOpen}
          className="p-3 bg-black/30 backdrop-blur-xl text-white rounded-full border border-white/20 active:scale-95 transition-all"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleSettingOpen}
          className="p-3 bg-black/30 backdrop-blur-xl text-white rounded-full border border-white/20 active:scale-95 transition-all"
        >
          <SettingIcon className="w-5 h-5" />
        </button>
      </div>

      {/* --- MODALS (KEEPING YOUR EXISTING LOGIC) --- */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[1000] rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-neutral">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div
                    className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl"
                    onClick={triggerFileInput}
                  >
                    <ProfilePic
                      imgSrc={
                        previewImage || getFullImgPath(editForm?.profileImg)
                      }
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                      <CameraIcon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
                <div className="space-y-4">
                  <input
                    name="username"
                    value={editForm.username || ""}
                    onChange={handleChange}
                    placeholder="Username"
                    className="input input-bordered w-full rounded-2xl"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      name="firstName"
                      value={editForm.firstName || ""}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="input input-bordered w-full rounded-2xl"
                    />
                    <input
                      name="lastName"
                      value={editForm.lastName || ""}
                      onChange={handleChange}
                      placeholder="Last Name"
                      className="input input-bordered w-full rounded-2xl"
                    />
                  </div>
                  <select
                    name="gender"
                    value={editForm.gender || "MALE"}
                    onChange={handleChange}
                    className="select select-bordered w-full rounded-2xl"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  <textarea
                    name="bio"
                    value={editForm.bio || ""}
                    onChange={handleChange}
                    placeholder="Bio"
                    className="textarea textarea-bordered w-full rounded-2xl resize-none"
                    rows="3"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full h-14 rounded-2xl font-black text-lg"
                >
                  SAVE CHANGES
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {settingForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingForm(false)}
              className="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[1000] rounded-t-[40px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-neutral">Settings</h2>
                <button
                  onClick={() => setSettingForm(false)}
                  className="p-2 bg-gray-100 rounded-full"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={hdlLogout}
                  className="btn btn-ghost justify-start text-lg font-bold rounded-2xl h-14 hover:bg-primary/5 hover:text-primary transition-all"
                >
                  Log out
                </button>
                <button
                  onClick={hdlDeleteAccount}
                  className="btn btn-ghost justify-start text-lg font-bold rounded-2xl h-14 text-error hover:bg-error/5 transition-all"
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- BOTTOM SHEET --- */}

      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: yPosition }}
        style={{
          y,
          height: "95vh",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 150 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 600 }}
        dragElastic={0.15}
        onDragEnd={(_, info) => {
          if (info.offset.y < -50 || info.velocity.y < -300) setStep("high");
          else if (info.offset.y > 50 || info.velocity.y > 300) setStep("half");
        }}
        className=" fixed inset-x-0 bottom-0  bg-black/40 backdrop-blur-md rounded-3xl
       shadow-[0_-20px_60px_rgba(0,0,0,0.4)] border-t border-white/10 z-40 flex flex-col overflow-hidden"
      >
        <div className="w-16 h-1.5 bg-white/70 rounded-full mx-auto my-4 flex-shrink-0" />

        <div className="overflow-y-auto px-6 pb-48   scrollbar-hide">
          {/* Profile Content */}
          <div className="mb-8">
            <div className="flex justify-between items-start ">
              <div className="flex-">
                <h2 className="text-4xl font-black text-white tracking-tight mb-1">
                  {profileData?.username}
                </h2>
                <p className="text-[12px] font-light text-white uppercase tracking-[0.2em] mb-4">
                  {profileData?.firstName} {profileData?.lastName}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-8 ">
                <NavLink
                  to="/calendar"
                  className=" flex  items-center justify-center tracking-[4px] active:scale-95   relative"
                >
                  <div className="calendar-neon-btn -z-10" />
                  <span className="calendar text-[18px]  absolute top-0 ">🗓️</span>
                </NavLink>

                <span className="p-2  backdrop-blur-xl text-white rounded-full border border-white/20 text-[10px]">
                  {profileData?.gender || "Secret"}
                </span>
              </div>
            </div>

            {/* About Section */}
            <div className=" relative overflow-hidden">
              <p className="text-white font-light leading-normal text-[18px]">
                "{profileData?.bio || "Tell Me About Yourself..."}"
              </p>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-around  p-2 ">
              <NavLink
                to="/reviews-rating"
                className="flex flex-col items-center flex-1 group"
              >
                <span className="text-2xl font-black text-primary group-active:scale-90 transition-transform">
                  {averageScore}
                </span>
                <span className="text-[10px] font-light text-white uppercase tracking-wider mt-1">
                  Rating
                </span>
              </NavLink>

              <button
                onClick={() => navigate("/created-activities", { state: { createdActivities: activities, title: "My Created Activities" } })}
                className="flex flex-col items-center flex-1"
              >
                <span className="text-2xl font-black text-white">
                  {profileData?._count?.createdActivities || 0}
                </span>
                <div className="text-[10px] font-light text-white uppercase tracking-wider mt-1">
                  <span>Events</span>
                </div>
              </button>

              <NavLink
                to="/friendlist"
                className="flex flex-col items-center flex-1 group"
              >
                <span className="text-2xl font-black text-white group-active:scale-90 transition-transform">
                  {profileData?.friendsCount || 0}
                </span>
                <span className="text-[10px] font-light text-white uppercase tracking-wider mt-1">
                  Friends
                </span>
              </NavLink>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {interestsFromStore && interestsFromStore.length > 0 ? (
                interestsFromStore.map((catValue, index) => {
                  const match = interests.find((i) => i.value === catValue);
                  return match ? (
                    <div
                      key={index}
                      className="px-3 py-1.5 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-xs text-white  font-medium"
                    >
                      {match.label}
                    </div>
                  ) : null;
                })
              ) : (
                <p className="text-[10px] text-white/20 italic">
                  No interests added yet
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 min-h-[400px]">
            <MyActivityTab />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
