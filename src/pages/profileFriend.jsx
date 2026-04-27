import { useEffect, useState } from "react";
import ProfilePic from "../components/profile/ProfilePic";
import { LeftIcon, ChatIcon } from "../icons";
import { useNavigate } from "react-router";
import MyActivityTab from "../components/profile/MyActivityTab";
import useUserStore from "../stores/userStore";
import Swal from 'sweetalert2';

const ProfileFriend = () => {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const getProfile = useUserStore((state) => state.getProfile);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      await getProfile();
      setLoading(false);
    };
    fetchProfile();
  }, [getProfile]);

  const handleAddFriend = () => {
    Swal.fire({
      icon: 'success',
      title: 'Friend request sent!',
      text: `You sent a request to ${user?.username}. Notifications should appear!`,
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleGoBack = () => navigate(-1);

  const getFullImgPath = (path) => {
    if (!path) return "/default-avatar.png";
    if (path.startsWith('http')) return path;
    return `http://localhost:3999${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="bg-base-200 min-h-screen flex flex-col font-sans pb-24 relative overflow-x-hidden">

      {/* --- HEADER --- */}
      <div className="pt-8 pb-4 flex items-center px-6 relative">
        <button
          onClick={handleGoBack}
          className="p-2 bg-white rounded-full shadow-sm text-primary active:scale-90 transition-all"
        >
          <LeftIcon className="w-6 h-6" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 font-bold text-lg text-neutral">
          User Profile (Store View)
        </h1>
      </div>

      {/* --- PROFILE INFO --- */}
      <div className="px-6 flex flex-col">
        <div className="flex items-center w-full gap-4 mb-6 mt-4">
          <div style={{ width: '112px', height: '112px', borderRadius: '100%', overflow: "hidden", border: '4px solid white', shadow: 'lg' }}>
            <ProfilePic imgSrc={getFullImgPath(user?.profileImg)} />
          </div>
          <div className="flex-1 flex flex-col">
            <h2 className="text-xl bai-jamjuree-bold text-neutral mb-2">
              {user?.username || "Unknown User"}
            </h2>
            <div className="bg-primary w-full rounded-[30px] py-3 flex justify-around text-white shadow-lg">
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg bai-jamjuree-bold">
                  4.5
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Rating
                </span>
              </div>

              <div className="flex flex-col items-center border-x border-white/30 flex-1">
                <span className="text-lg bai-jamjuree-bold">
                  {user?._count?.createdActivities || 0}
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Events
                </span>
              </div>
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg bai-jamjuree-bold">
                  {user?._count?.receivedFriendRequests || 0}
                </span>
                <span className="text-[10px] bai-jamjuree-medium opacity-90">
                  Friends
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={handleAddFriend}
            className="flex-1 bg-primary text-white py-3 rounded-2xl bai-jamjuree-bold shadow-md active:scale-95 transition-transform"
          >
            Add Friend 👋
          </button>
          <button
            onClick={() => navigate('/chat')}
            className="w-14 h-14 bg-white text-primary flex items-center justify-center rounded-2xl shadow-sm active:scale-95 transition-transform border border-primary/10"
          >
            <ChatIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full text-left space-y-2 mb-6">
          <div className="flex justify-between items-start">
            <p className="text-sm bai-jamjuree-medium text-neutral leading-relaxed max-w-[80%]">
              {user?.bio || "No bio available"}
            </p>
            <span className="text-[10px] px-2 py-1 bg-gray-100 rounded-md text-gray-400 font-bold uppercase tracking-wider">
              {user?.gender || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <MyActivityTab />
      </div>
    </div>
  );
};

export default ProfileFriend;