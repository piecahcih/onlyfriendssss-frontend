import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import ProfilePic from '../components/profile/ProfilePic';
import useUserStore from '../stores/userStore';

// --- Local Icons ---
const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EditIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const CameraIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const Profile = ({
  initialUser = {
    username: "Mr. Catlover",
    firstName: "Cat",
    lastName: "Lover",
    profilePic: null, // เพิ่มฟิลด์สำหรับเก็บรูป
    rating: 4.9,
    events: 10,
    friends: 122,
    isFriend: false,
    bio: "Tell me your favorite colors, I wanna know you",
    gender: "Male",
    tags: ['Talkative', 'Good manners', 'Foodie', 'Super User']
  },
  onRequestFriend = () => alert("Friend Request Sent!")
}) => {
  // --- States ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userProfile');
    return savedUser ? JSON.parse(savedUser) : initialUser;
  });
  const [activeTab, setActiveTab] = useState("Joined");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);
  const tabs = ["Joined", "Created", "Memory"];

  // --- Refs ---
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(user));
  }, [user]);

  // --- Handlers ---
  const handleEditOpen = () => {
    setEditForm({ ...user }); 
    setIsEditing(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setUser({ ...editForm }); 
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large! Please choose an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="bg-base-200 min-h-screen flex flex-col font-sans pb-24 relative overflow-x-hidden">
      
      {/* --- EDIT MODAL --- */}
      <AnimatePresence>
        {isEditing && (
          <>
            {/* Background Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm"/>
            
            {/* Modal Content */}
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-8 shadow-2xl max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl bai-jamjuree-bold text-neutral-focus">Edit Profile</h2>
                <button 
                  onClick={() => setIsEditing(false)} 
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <CloseIcon className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                
                {/* Profile Picture Upload Section */}
                <div className="flex flex-col items-center mb-4">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/10 shadow-inner bg-gray-50">
                      <ProfilePic imgSrc={user?.profileImg} />
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
                  <p className="text-[10px] bai-jamjuree-medium text-gray-400 mt-2 uppercase">Tap image to change</p>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">Username</label>
                  <input 
                    name="username" 
                    value={editForm.username} 
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"/>
                </div>

                {/* Names Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">First Name</label>
                    <input 
                      name="firstName" 
                      value={editForm.firstName} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"/>
                  </div>
                  <div>
                    <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">Last Name</label>
                    <input 
                      name="lastName" 
                      value={editForm.lastName} 
                      onChange={handleChange}
                      className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20"/>
                  </div>
                </div>

                {/* Gender Selector */}
                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">Gender</label>
                  <select 
                    name="gender" 
                    value={editForm.gender} 
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm bai-jamjuree-semibold text-gray-500 mb-1.5 ml-1">Bio</label>
                  <textarea 
                    name="bio" 
                    value={editForm.bio} 
                    onChange={handleChange} 
                    rows="3"
                    placeholder="Tell us about yourself..."
                    className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"/>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-primary text-white rounded-2xl bai-jamjuree-bold shadow-lg shadow-primary/30 active:scale-95 transition-all mt-4">
                  Save Changes
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="pt-12 pb-4 text-center relative flex items-center justify-center">
        <h1 className="text-xl bai-jamjuree-bold text-neutral-focus">Profile</h1>
        <button 
          onClick={handleEditOpen}
          className="absolute right-6 top-11 p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-90 transition-all text-primary">
          <EditIcon className="w-5 h-5" />
        </button>
      </div>

      {/* --- PROFILE INFO --- */}
      <div className="px-6 flex flex-col">
        <div className="flex items-center w-full gap-4 mb-6">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-white">
            <ProfilePic src={user.profilePic} />
          </div>

          <div className="flex-1 flex flex-col">
            <h2 className="text-xl bai-jamjuree-bold text-neutral mb-2">
              {user.username}
            </h2>
            <div className="bg-primary w-full rounded-[30px] py-4 flex justify-around text-white shadow-lg">
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">{user.rating}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Rating</span>
              </div>
              <div className="flex flex-col items-center border-r border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">{user.events}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Events</span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg bai-jamjuree-bold">{user.friends}</span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">Friends</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onRequestFriend}
          className="bg-secondary text-white w-full py-3 rounded-2xl bai-jamjuree-semibold mb-6 shadow-md active:scale-95 transition-transform">
          {user.isFriend ? "Friend ✔" : "Request to be Friend +"}
        </button>

        {/* Bio Section */}
        <div className="w-full text-left space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <p className="text-sm bai-jamjuree-medium text-neutral leading-relaxed max-w-[80%]">{user.bio}</p>
            <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-md text-gray-400 font-bold uppercase tracking-wider">
              {user.gender}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            {user.tags.map((tag) => (
              <span key={tag} className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-medium shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex border-b border-gray-200 mb-6 relative px-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-lg bai-jamjuree-bold transition-all relative z-10 ${
              activeTab === tab ? "text-primary" : "text-neutral opacity-60"}`}>
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}/>
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
            transition={{ duration: 0.2 }}>
            {activeTab === "Joined" && (
              <div className="bg-white rounded-[45px] overflow-hidden shadow-sm mb-6 border border-gray-100">
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Yoga" 
                    className="w-full h-full object-cover"
                  />
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
                          <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-white text-xs bai-jamjuree-bold">
                        +12
                      </div>
                    </div>
                    <span className="text-secondary bai-jamjuree-medium text-sm">Going</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "Created" && (
              <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">
                No events created yet.
              </div>
            )}
            
            {activeTab === "Memory" && (
              <div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">
                No memories shared yet.
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};

export default Profile;