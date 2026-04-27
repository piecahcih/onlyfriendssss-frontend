import React, { useEffect, useState, useMemo } from 'react'
import PremiumModal from '../components/ads/PremiumModal'
import { ChatIcon, HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { useSpeechToText } from '../hooks/useSpeechToText';
import useActivityStore from '../stores/activitiesStore';
import NotificationModal from '../components/NotificationModal';
import LikeModal from '../components/LikeModal';
import useUserStore from '../stores/userStore';
import useWishlistStore from '../stores/wishlistStore';
import useNotificationStore from '../stores/notificationStore'
import { format, formatRelative } from 'date-fns';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import SuggestCard from '../components/SuggestCard';
import useFriendStore from '../stores/friendStore';



function HomePage() {
  const navigate = useNavigate();
  const [settingForm, setSettingForm] = useState(false)
  const [notiOpen, setNotiOpen] = useState(false);
  const [likeOpen, setLikeOpen] = useState(false);

  const friends = useFriendStore(st => st.friends)
  const getFriends = useFriendStore(st => st.getFriends)
  const friendActivities = useFriendStore(st => st.friendActivities)
  const getFriendActivities = useFriendStore(st => st.getFriendActivities)

  const user = useUserStore(st => st.user)
  const suggests = useUserStore(st => st.suggests)
  const getUserSuggestedActivitiesByInterest = useUserStore(st => st.getUserSuggestedActivitiesByInterest)
  const exploreActivities = useUserStore(st => st.exploreActivities)

  const activities = useActivityStore((state) => state.activities) || [];
  const upcomingActivities = useActivityStore((state) => state.upcomingActivities) || [];
  const getUpcomingActivities = useActivityStore((state) => state.getUpcomingActivities);

  const addWishlist = useWishlistStore(st => st.addWishlist);
  const { unreadCount } = useNotificationStore()


  const [localSuggests, setLocalSuggests] = useState([]);

  useEffect(() => {
    const hasSeenInSession = sessionStorage.getItem("hasSeenPremium");
    if (!hasSeenInSession) {
      const timer = setTimeout(() => {
        setSettingForm(true);
        sessionStorage.setItem("hasSeenPremium", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [])

  useEffect(() => {
    getUserSuggestedActivitiesByInterest();
  }, [getUserSuggestedActivitiesByInterest]);


  useEffect(()=>{
    getFriends()
    getFriendActivities()
  }, [getFriends, getFriendActivities])

  useEffect(() => {
    if (suggests.length > 0) {
      setLocalSuggests(suggests);
    }
  }, [suggests]);

  useEffect(() => {
    getUpcomingActivities()
  }, [activities])

  const handleSwipe = async (id, direction) => {
    if (direction === 'right') {
      await addWishlist(id);
    }
    setLocalSuggests(prev => prev.filter(act => act.id !== id));
  };

  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchText(transcript);
  });

  // Filter: 1 user per 1 latest activity, limit to 5 for Home Page
  const processedFriendActivities = useMemo(() => {
    if (!friendActivities) return [];
    
    const userMap = new Map();
    // Latest activity per friend
    friendActivities.forEach(item => {
      const userId = item?.user?.id;
      if (userId && !userMap.has(userId)) {
        userMap.set(userId, item);
      }
    });

    return Array.from(userMap.values()).slice(0, 5);
  }, [friendActivities]);

  return (
    <div className="min-h-screen bg-base-200 pb-24 overflow-x-hidden">
      <div className="pt-7 px-6">

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h1 className='font-bold text-[22px]'>Hello, {user.username}</h1>
            <p className='font-light text-[12px]'>Welcome to onlyfriendssss</p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setLikeOpen(true)}
              className="relative p-3 rounded-full bg-white/95 backdrop-blur-md shadow-md active:scale-95 transition-all"
            >
              <HeartIcon className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setNotiOpen(true)}
              className="relative p-3 rounded-full bg-white/95 backdrop-blur-md shadow-xl active:scale-95 transition-all"
            >
              <Notification className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-4 h-4 bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white rounded-full">
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="mt-5">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide -mr-6 pb-2">
            {upcomingActivities?.length > 0 ? (
              upcomingActivities.map((act) => (
                <NavLink to={`/activity-details?actid=${act.id}`} key={act.id}
                  className="relative w-[285px] shrink-0 snap-start group">
                  <div className="h-35 rounded-[14px] overflow-hidden relative shadow-sm">
                    <img src={act.coverPhoto} alt="Activity"
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/60 pointer-events-none" />

                    <div className="absolute top-3 left-3 right-3 text-white">
                      <h4 className='font-bold text-[16px] leading-tight drop-shadow-md truncate' >
                        {act.title}
                      </h4>
                      <p className='text-[11px] font-medium opacity-90' >
                        {act?.place?.placeName}
                      </p>
                    </div>

                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[12px] font-semibold bg-white/20 backdrop-blur-md px-2 py-1 rounded-md inline-block">
                        {formatRelative(new Date(act.eventStartTime), new Date())}
                      </p>
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="h-35 w-full rounded-[14px] bg-white flex items-center justify-center border-2 border-dashed border-gray-200 mr-6">
                <p className="text-gray-400 font-medium text-sm">
                  You have no upcoming activities.
                </p>
              </div>
            )}
          </div>
        </div>


        {/* Suggested Section - Tinder Stack */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className='font-bold text-[18px]'>Suggested For You</h3>
          </div>

          <div className="relative h-75 w-57 mx-auto">
            <AnimatePresence>
              {localSuggests.length > 0 ? (
                localSuggests.reverse().map((act, index, simplifiedArray) => (
                  <div key={act.id}>
                    <SuggestCard
                      act={act}
                      onSwipe={handleSwipe}
                      index={(simplifiedArray.length - 1) - index}
                      total={localSuggests.length}
                    />
                    {/* <div className="z-[199] text-red-500 text-[50px] absolute top-1">{simplifiedArray.length}</div> */}
                  </div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => exploreActivities()}
                  className="w-full h-[310px] bg-white rounded-[14px] shadow-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-primary/5 transition-colors">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Want to explore more?</h4>
                  <p className="text-sm text-gray-500 mb-6">
                    We've run out of suggestions based on your interests.
                  </p>
                  <button className="btn btn-primary btn-sm rounded-full px-6">
                    Explore All
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-12 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className='font-bold'>What's your friends doing?</h3>
            {friendActivities?.length > 5 && (
              <button 
                onClick={() => navigate('/all-friend-activities', { state: { friendActivities } })}
                className="text-xs font-bold text-primary hover:underline"
              >
                See More &gt;
              </button>
            )}
          </div>
          <div className="flex flex-col gap-3 w-full">
            {processedFriendActivities?.length > 0 ? (
              processedFriendActivities.map((item) => (
                <NavLink to={`/activity-details?actid=${item?.activityId}`} key={item?.id}>
                  <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100 active:scale-95 transition-transform">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden shrink-0">
                      <img 
                        src={item?.user?.profileImg || '/assets/default-profilepic.jpg'} 
                        className="w-full h-full object-cover" 
                        onError={(e) => e.target.src = '/assets/default-profilepic.jpg'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium mb-1 truncate">
                        <span className="font-bold">{item?.user?.username || 'Someone'} </span>
                        <span>is {item?.action || 'doing something'}</span>
                        <span className='text-[#6e2f12] font-semibold'> {item?.activityTitle || 'an activity'}</span>
                      </p>
                      <p className='text-[10px] text-gray-400'>
                        {item?.createdAt ? formatRelative(new Date(item.createdAt), new Date()) : 'recently'}
                      </p>
                    </div>
                    <div className="bg-secondary rounded-2xl px-3 py-1 text-[12px] font-bold text-[#6e2f12] shrink-0">
                      View
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100">
                <p className="text-gray-400 font-medium text-sm">
                  No recent activities from your friends.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="fixed bottom-22 right-3 z-150">
        <button
          type="button"
          onClick={() => alert('paichatja')}
          className="relative p-3 rounded-full bg-white/95 backdrop-blur-md shadow-md active:scale-95 transition-all"
        >
          <ChatIcon className="w-5 h-5" />
        </button>
      </div>

      <LikeModal isOpen={likeOpen} onClose={() => setLikeOpen(false)} />
      <NotificationModal isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
      <PremiumModal
        isOpen={settingForm}
        onClose={() => setSettingForm(false)}
      />
    </div>
  )
}

export default HomePage