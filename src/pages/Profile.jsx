import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePic from "../components/profile/ProfilePic";
import useUserStore from "../stores/userStore";
import {
  LocationIcon,
  SettingIcon,
  CalendarIcon,
  CloseIcon,
  CameraIcon,
  EditIcon,
  HeartLineIcon,
  HeartIcon,
} from "../icons";
import { NavLink } from "react-router";
import {
  getProfileApi,
  SendFriendRequestApi,
  editProfileApi,
} from "../api/mainApi";

import MyActivityTab from "../components/profile/MyActivityTab";

const BACKEND_URL = "http://localhost:3999";

const Profile = () => {
  const storeUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [settingForm, setSettingForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfileApi();
      const data =
        response.data.user?.data || response.data.user || response.data;
      console.log("Gender from API:", data);

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
  const hdlLogout = () => logout();

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

  const triggerFileInput = () => fileInputRef.current.click();

  const handleRequestFriend = async () => {
    try {
      await SendFriendRequestApi(profileData.id);
      alert("Success!");
    } catch (error) {
      alert(error.response?.data?.message || "Failed");
    }
  };

  const getFullImgPath = (path) => {
    if (!path) return "/default-avatar.png"; // ใส่รูป Default ถ้าไม่มีข้อมูล

    // ถ้าเป็น File Object (กรณีเพิ่งเลือกรูป) หรือ Base64 ให้คืนค่าเดิม
    if (typeof path !== "string" || path.startsWith("data:")) {
      return path;
    }

    // ถ้าเป็น URL เต็มอยู่แล้ว (เช่นจาก Google Login)
    if (path.startsWith("http")) {
      return path;
    }

    // 3. ถ้าเป็น path จาก backend
    return `${BACKEND_URL}${path}`;
  };

  if (!profileData)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="bg-base-200 min-h-screen flex flex-col font-sans pb-24 relative overflow-x-hidden">
      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {isEditing && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl bai-jamjuree-bold text-neutral-focus">
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner bg-gray-50">
                      <ProfilePic
                        imgSrc={
                          previewImage || getFullImgPath(editForm?.profileImg)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CameraIcon className="w-8 h-8 text-white" />
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="text-[10px] bai-jamjuree-medium text-gray-400 mt-2 uppercase">
                    Tap to change photo
                  </p>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">
                    Username
                  </label>
                  <input
                    name="username"
                    value={editForm.username || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={editForm.firstName || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={editForm.lastName || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={editForm.gender || "MALE"}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={editForm.bio || ""}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-2xl bai-jamjuree-bold shadow-lg shadow-primary/30 active:scale-95 transition-all mt-4"
                >
                  SAVE
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- SETTING MODAL --- */}
      <AnimatePresence>
        {settingForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingForm(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl bai-jamjuree-bold text-neutral-focus">
                  Settings
                </h2>
                <button
                  onClick={() => setSettingForm(false)}
                  className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-col gap-4 items-start text-[18px]">
                <button
                  onClick={hdlLogout}
                  className="font-medium text-neutral-focus"
                >
                  Log out
                </button>
                <button className="font-medium text-error">
                  Delete Account
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="pt-8 pb-4 text-center relative flex items-center justify-center">
        {/* <h1 className="text-xl bai-jamjuree-bold text-neutral-focus">PROFILE</h1> */}
        <div className="absolute right-6 top-4 flex gap-2">
          <button
            onClick={handleEditOpen}
            className="p-2 bg-white rounded-full shadow-sm text-primary active:scale-90 transition-all"
          >
            <EditIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleSettingOpen}
            className="p-2 bg-white rounded-full shadow-sm text-primary active:scale-90 transition-all"
          >
            <SettingIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- PROFILE INFO --- */}
      <div className="px-6 flex flex-col">
        <div className="flex items-center w-full gap-4 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-md flex-shrink-0 bg-white">
            <ProfilePic imgSrc={getFullImgPath(profileData?.profileImg)} />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl bai-jamjuree-bold text-neutral mb-2">
              {profileData?.username}
            </h2>
            <div className="bg-primary w-full rounded-[30px] py-3 flex justify-around text-white shadow-lg">
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">
                  {profileData?.trustScore || 0}
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Rating
                </span>
              </div>
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">
                  {profileData?._count?.createdActivities || 0}
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Events
                </span>
              </div>
              <NavLink
                to="/friendlist"
                className="flex flex-col items-center flex-1"
              >
                <span className="text-lg bai-jamjuree-bold">
                  {profileData?._count?.receivedFriendRequests || 0}
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Friends
                </span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* <button
          onClick={handleRequestFriend}
          className="bg-secondary text-white w-full py-3 rounded-2xl bai-jamjuree-semibold mb-6 shadow-md active:scale-95 transition-transform">
          {profileData.isFriend ? "Friend ✔" : "Request to be Friend +"}
        </button> */}

        <div className="w-full text-left space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <p className="text-sm bai-jamjuree-medium text-neutral leading-relaxed max-w-[80%]">
              {profileData?.bio || "No bio available"}
            </p>
            <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-md text-gray-400 font-bold uppercase tracking-wider">
              {profileData?.gender === "MALE" ? "MALE" :
               profileData?.gender === "FEMALE" ? "FEMALE" :
               profileData?.gender === "OTHER" ? "OTHER" : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <MyActivityTab />
    </div>
  );
};

export default Profile;
