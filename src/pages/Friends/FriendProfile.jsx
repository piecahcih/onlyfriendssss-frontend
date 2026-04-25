import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { format } from "date-fns";
import { toast } from "react-toastify";

import useUserStore from "../../stores/userStore";
import useFriendStore from "../../stores/friendStore";
import useReviewStore from "../../stores/reviewStore";
import { getFriendProfileApi, SendFriendRequestApi, UnfriendApi } from "../../api/mainApi";
import { LeftIcon } from "../../icons";

const FriendProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  const [profileData, setProfileData] = useState(null);

  const currentUser = useUserStore((state) => state.user);
  const { friends, getFriends } = useFriendStore();
  const { userRatings, getUserRatings } = useReviewStore();

  useEffect(() => {
    if (!userId) return navigate("/friendlist");
    fetchFriendProfile();
    getUserRatings();
    if (friends.length === 0) getFriends();
  }, [userId]);

  const fetchFriendProfile = async () => {
    const res = await getFriendProfileApi(userId);
    setProfileData(res.data.user || res.data);
  };

  const handleAddFriend = async () => {
    await SendFriendRequestApi(userId);
    toast.success("Friend request sent!");
  };

  const currentFriend = friends.find((f) => String(f.id) === String(userId));

  const handleUnfriend = async () => {
    if (!window.confirm(`Unfriend ${profileData?.username}?`)) return;
    if (currentFriend?.friendshipId) {
      await UnfriendApi(currentFriend.friendshipId);
      await getFriends();
      toast.success("Unfriended successfully");
    }
  };

  if (!profileData) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  const isSelf = String(currentUser?.id) === String(userId);
  const isFriend = !!currentFriend;
  const averageScore = userRatings.find((u) => String(u.id) === String(profileData.id))?.averageRating || "0.0";

  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <img src={profileData.profileImg} className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none" alt="bg" />

      <div className="relative z-10 p-5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full">
          <LeftIcon className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center px-6">

        <img src={profileData.profileImg} className="w-28 h-28 rounded-full object-cover border-2 border-white/20 mb-4" alt="avatar" />
        <h2 className="text-2xl font-bold">{profileData.username}</h2>
        <p className="text-gray-400 mt-1">{profileData.firstName} {profileData.lastName}</p>

        {profileData.createdAt && (
          <p className="text-xs text-gray-500 mt-2">
            Joined {format(new Date(profileData.createdAt), "MMMM yyyy")}
          </p>
        )}

        <div className="flex justify-between w-full max-w-xs mt-6 bg-white/5 rounded-2xl p-4">
          <div className="text-center">
            <p className="text-xl font-bold text-primary">{averageScore}</p>
            <p className="text-[10px] text-gray-400 mt-1">RATING</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{profileData._count?.createdActivities || 0}</p>
            <p className="text-[10px] text-gray-400 mt-1">EVENTS</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold">{profileData._count?.receivedFriendRequests || 0}</p>
            <p className="text-[10px] text-gray-400 mt-1">FRIENDS</p>
          </div>
        </div>

        <div className="w-full mt-6">
          <p className="text-xs font-bold text-gray-500 mb-2">ABOUT</p>
          <div className="bg-white/5 rounded-2xl p-4 text-sm text-gray-300">
            {profileData.bio || "No bio available."}
          </div>
        </div>

        {profileData.reviewsReceived?.length > 0 && (
          <div className="w-full mt-6">
            <p className="text-xs font-bold text-gray-500 mb-2">REVIEWS</p>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {profileData.reviewsReceived.map((review, idx) => (
                <div key={idx} className="min-w-[200px] bg-white/5 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <img src={review.reviewer?.profileImg} className="w-8 h-8 rounded-full object-cover" alt="reviewer" />
                    <div>
                      <p className="text-xs font-bold">{review.reviewer?.firstName}</p>
                      <p className="text-[10px] text-yellow-500">{"★".repeat(review.rating)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">"{review.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isSelf && (
          <div className="w-full mt-8">
            {isFriend ? (
              <button onClick={handleUnfriend} className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl">
                Remove Friend
              </button>
            ) : (
              <button onClick={handleAddFriend} className="w-full py-4 bg-primary text-white font-bold rounded-2xl">
                Add Friend
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FriendProfile;