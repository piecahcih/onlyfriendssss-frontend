import React, { useEffect, useState, useMemo } from 'react'
import PremiumModal from '../components/ads/PremiumModal'
import { ChatIcon, HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { useSpeechToText } from '../hooks/useSpeechToText';
import useActivityStore from '../stores/activitiesStore';
import NotificationModal from '../components/NotificationModal';
import LikeModal from '../components/LikeModal';
import useUserStore from '../stores/userStore';
import useWishlistStore from '../stores/wishlistStore';
import { format, formatRelative } from 'date-fns';
import { NavLink } from 'react-router';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import SuggestCard from '../components/SuggestCard';
import useFriendStore from '../stores/friendStore';



function HomePage() {
  const [settingForm, setSettingForm] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [notiOpen, setNotiOpen] = useState(false);
  const [likeOpen, setLikeOpen] = useState(false);

  const friends = useFriendStore(st=>st.friends)

  const user = useUserStore(st=>st.user)
  const suggests = useUserStore(st=>st.suggests)
  const getUserSuggestedActivitiesByInterest = useUserStore(st=>st.getUserSuggestedActivitiesByInterest)
  
  const activities = useActivityStore((state) => state.activities) || [];
  const upcomingActivities = useActivityStore((state) => state.upcomingActivities) || [];
  const getUpcomingActivities = useActivityStore((state) => state.getUpcomingActivities);
  
  const addWishlist = useWishlistStore(st => st.addWishlist);

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

  useEffect(()=>{
    getUserSuggestedActivitiesByInterest()
  },[getUserSuggestedActivitiesByInterest])

  useEffect(() => {
    if (suggests.length > 0) {
      setLocalSuggests(suggests);
    }
  }, [suggests]);

  useEffect(()=>{
    getUpcomingActivities()
  },[activities])

  const handleSwipe = async (id, direction) => {
    if (direction === 'right') {
      await addWishlist(id);
    }
    setLocalSuggests(prev => prev.filter(act => act.id !== id));
  };

  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchText(transcript);
  });

  return (
    <div className="min-h-screen bg-base-200 pb-24 overflow-x-hidden">
      <div className="pt-8 px-6">

        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h1 className='font-bold text-[20px]'>Hello, {user.username}</h1>
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
              className="relative p-3 rounded-full bg-white/95 backdrop-blur-md shadow-md active:scale-95 transition-all"
            >
              <Notification className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white rounded-full">
                1
              </span>
            </button>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="mt-5">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide -mr-6 pb-2">
            {upcomingActivities?.length > 0 ? (
              upcomingActivities.map((act) => (
                <NavLink to={`/activity-details?actid=${act.id}`} key={act.id} className="relative w-[285px] shrink-0 snap-start">
                  <div className="h-35 rounded-[14px] overflow-hidden shadow-lg">
                    <img src={act.coverPhoto} alt="Activity" className='w-full h-full object-cover' />
                  </div>
                  <div className="absolute top-1 left-1 right-4 text-white">
                    <p className='text-[10px] font-black bg-primary px-2 py-0.5 rounded inline-block mb-1 tracking-widest' >UPCOMING</p> 
                    <p className='font-bold text-lg' >{act.title}</p> 
                    <p className='text-[11px] font-medium opacity-80' >{act?.place?.placeName}</p> 
                  </div>
                    <p className="absolute bottom-4 left-1 text-[14px] text-white font-medium capitalize">
                      {formatRelative(new Date(act.eventStartTime), new Date())}
                    </p>
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
            <h3 className='font-bold text-lg'>Suggested For You</h3>
            <span className="text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">
              {localSuggests.length} Picks
            </span>
          </div>
          
          <div className="relative h-75 w-54 mx-auto">
            <AnimatePresence>
              {localSuggests.length > 0 ? (
                localSuggests.slice(0, 3).reverse().map((act, index) => (
                  <SuggestCard 
                    key={act.id} 
                    act={act} 
                    onSwipe={handleSwipe} 
                    index={2 - index} // Fixed index mapping for reversed slice
                    total={localSuggests.length}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-white/50 backdrop-blur-sm rounded-[30px] border border-dashed border-gray-300"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <SearchIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-bold text-gray-800">No more suggestions</h4>
                  <p className="text-sm text-gray-500 mt-1">Check back later or change your interests!</p>
                  <button 
                    onClick={() => setLocalSuggests(suggests)}
                    className="mt-6 text-sm font-bold text-primary px-6 py-2 rounded-full border border-primary/20 hover:bg-primary/5 transition-colors"
                  >
                    Refresh List
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-14 mb-4">
          <h3 className='font-bold mb-4'>Friends Activity</h3>
          <div className="flex flex-col gap-3 w-full">
            {/* <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100">
               <div className="w-12 h-12 bg-gray-200 rounded-full" />
               <div className="flex-1">
                 <div className="h-4 w-24 bg-gray-100 rounded mb-2" />
                 <div className="h-3 w-32 bg-gray-50 rounded" />
               </div>
            </div> */}
            {friends?.length > 0 ? (
              friends.map((friend) => (
                <NavLink to={`/activity-details?actid=${friend.id}`} key={friend.id}>
                  <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                      <img src={friend.profileImg} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{friend.username}</h3>
                      <div className="h-3 w-32 bg-gray-50 rounded" />
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="bg-white p-4 rounded-[20px] flex items-center gap-4 shadow-sm border border-gray-100">
                <p className="text-gray-400 font-medium text-sm">
                  Your have no friends..
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
          <ChatIcon className="w-5 h-5"/>
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