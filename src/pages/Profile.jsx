import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePic from "../components/profile/ProfilePic";
import useUserStore from "../stores/userStore";
import { LocationIcon, SettingIcon, CalendarIcon,CloseIcon,CameraIcon,  EditIcon } from "../icons";
import { NavLink } from "react-router";
import {
  getProfileApi,
  SendFriendRequestApi,
  editProfileApi,
} from "../api/mainApi";

const BACKEND_URL = "http://localhost:3999";

const Profile = () => {
  const storeUser = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const logout = useUserStore((state) => state.logout);

  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState("Joined");
  const [isEditing, setIsEditing] = useState(false);
  const [settingForm, setSettingForm] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  
  const tabs = ["Joined", "Created", "Memory"];
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await getProfileApi();
      const data = response.data.user?.data || response.data.user || response.data;
      console.log("Gender from API:", data.gender)
      
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
      
      const updatedUser = response.data.user;

      if (updatedUser.profileImg) {
      updatedUser.profileImg = `${updatedUser.profileImg}?t=${Date.now()}`;
       }
      setProfileData(updatedUser);
      setUser(updatedUser);
      
      fetchUserProfile();
      setIsEditing(false);
      setPreviewImage(null); 
      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "เกิดข้อผิดพลาดในการบันทึก");
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
        alert("ขนาดไฟล์ใหญ่เกินไป (จำกัด 2MB)");
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
      alert("ส่งคำขอเป็นเพื่อนแล้ว!");
    } catch (error) {
      alert(error.response?.data?.message || "ไม่สามารถส่งคำขอได้");
    }
  };

 const getFullImgPath = (path) => {
 if (!path) return "/default-avatar.png"; // ใส่รูป Default ถ้าไม่มีข้อมูล
    
       // ถ้าเป็น File Object (กรณีเพิ่งเลือกรูป) หรือ Base64 ให้คืนค่าเดิม
     if (typeof path !== 'string' || path.startsWith('data:')) {
       return path;
     }
  
     // ถ้าเป็น URL เต็มอยู่แล้ว (เช่นจาก Google Login)
      if (path.startsWith('http')) {
        return path;
      }

  // 3. ถ้าเป็น path จาก backend
  return `${BACKEND_URL}${path}`;
};

  if (!profileData) return <div className="flex h-screen items-center justify-center">Loading...</div>;

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
                <h2 className="text-2xl bai-jamjuree-bold text-neutral-focus">แก้ไขโปรไฟล์</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner bg-gray-50">
                      <ProfilePic imgSrc={previewImage || getFullImgPath(editForm?.profileImg)} />
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <CameraIcon className="w-8 h-8 text-white" />
                    </button>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  <p className="text-[10px] bai-jamjuree-medium text-gray-400 mt-2 uppercase">แตะที่รูปเพื่อเปลี่ยน</p>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">ชื่อผู้ใช้</label>
                  <input name="username" value={editForm.username || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">ชื่อจริง</label>
                    <input name="firstName" value={editForm.firstName || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">นามสกุล</label>
                    <input name="lastName" value={editForm.lastName || ""} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">เพศ</label>
                  <select name="gender" value={editForm.gender || "MALE"} onChange={handleChange} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="MALE">ชาย</option>
                    <option value="FEMALE">หญิง</option>
                    <option value="OTHER">อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">แนะนำตัวเอง</label>
                  <textarea name="bio" value={editForm.bio || ""} onChange={handleChange} rows="3" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>

                <button type="submit" className="w-full py-4 bg-primary text-white rounded-2xl bai-jamjuree-bold shadow-lg shadow-primary/30 active:scale-95 transition-all mt-4">
                  บันทึกการเปลี่ยนแปลง
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
                <h2 className="text-2xl bai-jamjuree-bold text-neutral-focus">ตั้งค่า</h2>
                <button onClick={() => setSettingForm(false)} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <div className="flex flex-col gap-4 items-start text-[18px]">
                <button onClick={hdlLogout} className="font-medium text-neutral-focus">ออกจากระบบ</button>
                <button className="font-medium text-error">ลบบัญชี</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="pt-12 pb-4 text-center relative flex items-center justify-center">
        <h1 className="text-xl bai-jamjuree-bold text-neutral-focus">PROFILE</h1>
        <div className="absolute right-6 top-11 flex gap-2">
          <button onClick={handleEditOpen} className="p-2 bg-white rounded-full shadow-sm text-primary active:scale-90 transition-all">
            <EditIcon className="w-5 h-5" />
          </button>
          <button onClick={handleSettingOpen} className="p-2 bg-white rounded-full shadow-sm text-primary active:scale-90 transition-all">
            <SettingIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- PROFILE INFO --- */}
      <div className="px-6 flex flex-col">
        <div className="flex items-center w-full gap-4 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-white">
            <ProfilePic imgSrc={getFullImgPath(profileData?.profileImg)} />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl bai-jamjuree-bold text-neutral mb-2">
              {profileData?.username}
            </h2>
            <div className="bg-primary w-full rounded-[30px] py-4 flex justify-around text-white shadow-lg">
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">{profileData?.trustScore || 0}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Rating</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">{profileData?._count?.createdActivities || 0}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Events</span>
              </div>
              <NavLink to="/friendlist" className="flex flex-col items-center flex-1">
                <span className="text-lg bai-jamjuree-bold">{profileData?._count?.receivedFriendRequests || 0}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Friends</span>
              </NavLink>
            </div>
          </div>
        </div>

        <button
          onClick={handleRequestFriend}
          className="bg-secondary text-white w-full py-3 rounded-2xl bai-jamjuree-semibold mb-6 shadow-md active:scale-95 transition-transform">
          {profileData.isFriend ? "Friend ✔" : "Request to be Friend +"}
        </button>

        <div className="w-full text-left space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <p className="text-sm bai-jamjuree-medium text-neutral leading-relaxed max-w-[80%]">
              {profileData?.bio || "No bio available"}
            </p>
            <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-md text-gray-400 font-bold uppercase tracking-wider">
              {profileData?.gender === "MALE" ? "ชาย" :
               profileData?.gender === "FEMALE" ? "หญิง" :
               profileData?.gender === "OTHER" ? "อื่นๆ" : "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex border-b border-gray-200 mb-6 relative px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-lg bai-jamjuree-bold transition-all relative z-10 ${activeTab === tab ? "text-primary" : "text-neutral opacity-60"}`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* --- ACTIVITY CONTENT --- */}
      <div className="px-4 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Joined" && (
              <div className="bg-white rounded-[45px] overflow-hidden shadow-sm mb-6 border border-gray-100">
                <div className="relative h-64">
                  <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Yoga" className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-[#8b5cf6]/90 text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-semibold">Featured Host</span>
                    <span className="bg-secondary/90 text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-semibold">3 spots left</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl bai-jamjuree-bold text-neutral-focus mb-4">Golden Hour Sunset Yoga</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-neutral/70">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm bai-jamjuree-medium">Tomorrow, 06:30 PM</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral/70">
                      <LocationIcon className="w-5 h-5 text-primary" />
                      <span className="text-sm bai-jamjuree-medium">Pier 14, Waterfront Park</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                          <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-white text-xs bai-jamjuree-bold">+12</div>
                    </div>
                    <span className="text-secondary bai-jamjuree-medium text-sm">Going</span>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Created" && <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">No events created yet.</div>}
            {activeTab === "Memory" && <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">No memories shared yet.</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
