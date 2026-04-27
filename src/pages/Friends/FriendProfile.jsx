import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";

import useUserStore from "../../stores/userStore";
import useFriendStore from "../../stores/friendStore";
import Swal from "../../components/swal/FriendAlert";
import useReviewStore from "../../stores/reviewStore";
import { getFriendProfileApi, SendFriendRequestApi, UnfriendApi, getOrCreatePrivateRoomApi } from "../../api/mainApi";
import { LeftIcon, ChatIcon } from "../../icons";

const FriendProfile = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get("userId");

  const [profileData, setProfileData] = useState(null);
  const [step, setStep] = useState("half");
  // Initialize isRequested based on profileData from backend (assuming backend provides 'hasSentRequest')
  const [isRequested, setIsRequested] = useState(profileData?.hasSentRequest || false);
  const [activeTab, setActiveTab] = useState("Joined");
  const tabs = ["Joined", "Created", "Reviews"];
  const y = useMotionValue(0);
  const yPosition = step === "half" ? "55vh" : "10vh";

  const currentUser = useUserStore((state) => state.user);
  const friends = useFriendStore((state) => state.friends);
  const requests = useFriendStore((state) => state.requests);
  const sentRequests = useFriendStore((state) => state.sentRequests);
  const getFriends = useFriendStore((state) => state.getFriends);
  const acceptFriend = useFriendStore((state) => state.acceptFriend);

  useEffect(() => {
    if (!userId) return navigate("/friendlist");
    fetchFriendProfile();
    getFriends();
  }, [userId]);

  useEffect(() => {
    if (profileData) {
      // Assuming profileData will have a 'hasSentRequest' field
      setIsRequested(profileData.hasSentRequest || false);
    }
  }, [profileData]);

  const fetchFriendProfile = async () => {
    const res = await getFriendProfileApi(userId);
    setProfileData(res.data.user || res.data);
    console.log('Fetched Friend Profile Data:', res.data.user || res.data);
  };

  const handleAddFriend = async () => {
    try {
      await SendFriendRequestApi(userId);
      toast.success("Friend request sent!");
      setIsRequested(true);
      if (getFriends) getFriends();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send request");
    }
  };

  const currentFriend = friends.find((f) => String(f.id) === String(userId));
  const isFriend = !!currentFriend;

  const hasSentRequest = sentRequests?.some((r) => String(r.receiverId) === String(userId));

  const incomingRequest = requests?.find((r) => String(r.senderId) === String(userId));
  const hasIncomingRequest = !!incomingRequest;

  const handleUnfriend = async () => {
    const result = await Swal.fire({
      title: `<div class="font-black text-2xl tracking-tight text-neutral">Unfriend</div>`,
      html: `<div class="text-sm font-medium text-gray-500 mt-2">Remove <b>${profileData?.username}</b> from your friends?</div>`,
      icon: "question",
      iconColor: "#000",
      showCancelButton: true,
      confirmButtonText: "Yes, unfriend",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed && currentFriend?.friendshipId) {
      try {
        await UnfriendApi(currentFriend.friendshipId);
        if (getFriends) await getFriends();
        toast.success("Unfriended successfully");
      } catch (error) {
        console.error(error);
        toast.error("Failed to unfriend");
      }
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

  const handleStartChat = async () => {
    try {
      const res = await getOrCreatePrivateRoomApi(userId);
      const roomId = res.data?.roomId;
      if (roomId) {
        navigate(`/chat/${roomId}`, {
          state: {
            roomId,
            title: profileData.username,
            image: profileData.profileImg,
            friendId: userId
          }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Cannot open chat right now");
    }
  };

  return (
    <div className="min-h-screen bg-black text-black font-sans relative overflow-hidden">
      {/* Background Image Area (Top Half) - Fixed to make it smooth */}
      <div className="fixed inset-0 w-full h-[70vh]">
        <img
          src={profileData.profileImg}
          className="w-full h-full object-cover scale-105"
          alt="bg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
      </div>

      {/* Top Nav - Fixed */}
      <div className="fixed top-0 inset-x-0 p-5 flex justify-between items-center z-30">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white active:scale-90 transition-all">
          <LeftIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Name Info - Fixed */}
      <div
        className="fixed inset-x-0 flex flex-col items-center text-white z-10 px-4 transition-all duration-500"
        style={{ top: step === "half" ? "35vh" : "5vh", opacity: step === "half" ? 1 : 0 }}
      >
        <h1 className="text-3xl font-black tracking-tight drop-shadow-lg">
          {profileData.username}
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest opacity-80">{profileData.firstName} {profileData.lastName}</p>
      </div>

      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100vh" }}
        animate={{ y: yPosition }}
        style={{ y, height: "95vh" }}
        transition={{ type: "spring", damping: 30, stiffness: 180 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.04}
        onDragEnd={(_, info) => {
          if (info.offset.y < -100 || info.velocity.y < -500) setStep("high");
          else if (info.offset.y > 100 || info.velocity.y > 500) setStep("half");
        }}
        className="fixed inset-x-0 bottom-0 bg-white/85 backdrop-blur-2xl w-full max-w-lg mx-auto rounded-t-[40px] z-20 shadow-[0_-20px_60px_rgba(0,0,0,0.3)] border-t border-white/30 flex flex-col overflow-hidden"
      >
        {/* Drag Handle */}
        <div className="w-16 h-1.5 bg-gray-300/50 rounded-full mx-auto my-5 flex-shrink-0" />

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 pb-32 scrollbar-hide flex-1">

          {/* Action Buttons */}
          {!isSelf && (
            <div className="flex gap-3 mb-8">
              <button
                onClick={
                  isFriend
                    ? handleUnfriend
                    : hasIncomingRequest
                      ? () => acceptFriend(incomingRequest.id)
                      : (hasSentRequest || isRequested ? undefined : handleAddFriend)
                }
                className={`flex-1 py-3.5 border rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all ${(hasSentRequest || isRequested) && !isFriend
                  ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                  : 'border-gray-300 hover:bg-gray-50 active:scale-95'
                  }`}
              >
                {!isFriend && !hasSentRequest && !isRequested && !hasIncomingRequest && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.66-1.546" />
                  </svg>
                )}
                {isFriend ? "Unfriend" : (isRequested ? "Requested" : "Add Friend")}
              </button>
              <button
                onClick={handleStartChat}
                className="flex-1 py-3.5 border border-gray-300 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <ChatIcon className="w-5 h-5" />
                Message
              </button>
            </div>
          )}

          {/* About Me Section */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Bio</h3>
            <p className="text-gray-600 text-sm">
              {profileData.bio || "no bio yet"}
            </p>
          </div>

          {/* Interests Section */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-3">Interests</h3>
            {profileData.interests?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profileData.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-1.5 bg-primary/5 text-primary border border-primary/10 rounded-xl text-xs font-bold transition-all hover:bg-primary/10 hover:shadow-md hover:-translate-y-0.5 cursor-default flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/40"></span>
                    {interest.category || interest.name || interest}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No interests specified.</p>
            )}
          </div>

          {/* Tabbed Content Section */}
          <div className="mt-4">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200 mb-6 relative">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-sm font-bold transition-all relative z-10 ${activeTab === tab ? "text-primary" : "text-gray-400"}`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "Reviews" && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg">Reviews</h3>
                      <button
                        onClick={() => navigate(`/friend-reviews`, {
                          state: {
                            reviews: profileData.reviewsReceived,
                            title: `${profileData.firstName || profileData.username}'s Reviews`
                          }
                        })}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        See More &gt;
                      </button>
                    </div>

                    {profileData.reviewsReceived?.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {profileData.reviewsReceived.slice(0, 5).map((review, idx) => (
                          <div key={idx} className="min-w-[240px] border border-gray-100 bg-gray-50 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <img src={review.reviewer?.profileImg} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="reviewer" />
                              <div>
                                <p className="text-xs font-bold text-gray-800">{review.reviewer?.firstName}</p>
                                <p className="text-[10px] text-yellow-500">{"★".repeat(review.rating)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center py-4">No reviews yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "Joined" && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg">Joined Activities</h3>
                      <button
                        onClick={() => navigate(`/friend-joined-activities`, {
                          state: {
                            joinedActivities: profileData.joinRequests,
                            title: `${profileData.firstName || profileData.username}'s Joined Activities`
                          }
                        })}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        See More &gt;
                      </button>
                    </div>
                    {profileData.joinRequests?.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {profileData.joinRequests.slice(0, 5).map((joinData, idx) => {
                          const activity = joinData.activity
                          return (
                            <div
                              key={idx}
                              onClick={() => navigate(`/activity-details?actid=${activity.id}`)}
                              className="min-w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            >
                              <div className="h-24 bg-gray-200">
                                {activity?.coverPhoto && (
                                  <img src={activity.coverPhoto} className="w-full h-full object-cover" alt="activity" />
                                )}
                              </div>
                              <div className="p-3">
                                <p className="font-bold text-sm truncate">{activity?.title || "Untitled"}</p>
                                <p className="text-xs text-primary mt-1">{activity?.category || "General"}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center py-4">No joined activities yet.</p>
                    )}
                  </div>
                )}

                {activeTab === "Created" && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-lg">Created Activities</h3>
                      <button
                        onClick={() => navigate(`/friend-created-activities`, {
                          state: {
                            createdActivities: profileData.activities || profileData.createdActivities,
                            title: `${profileData.firstName || profileData.username}'s Created Activities`
                          }
                        })}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        See More &gt;
                      </button>
                    </div>
                    {profileData.activities?.length > 0 || profileData.createdActivities?.length > 0 ? (
                      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                        {(profileData.activities || profileData.createdActivities).slice(0, 5).map((activity, idx) => (
                          <div
                            key={idx}
                            onClick={() => navigate(`/activity-details?actid=${activity.id}`)}
                            className="min-w-[200px] border border-gray-200 rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <div className="h-24 bg-gray-200">
                              {activity.coverPhoto && (
                                <img src={activity.coverPhoto} className="w-full h-full object-cover" alt="activity" />
                              )}
                            </div>
                            <div className="p-3">
                              <p className="font-bold text-sm truncate">{activity.title}</p>
                              <p className="text-xs text-primary mt-1">{activity.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm italic text-center py-4">No activities created.</p>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default FriendProfile;