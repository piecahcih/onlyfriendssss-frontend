import React, { useEffect, useState } from 'react'
import PremiumModal from '../components/ads/PremiumModal'
import { HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { useSpeechToText } from '../hooks/useSpeechToText';
import useActivityStore from '../stores/activitiesStore';
import NotificationModal from '../components/NotificationModal';
import LikeModal from '../components/LikeModal';
import useUserStore from '../stores/userStore';
import { format, formatRelative } from 'date-fns';
import { NavLink } from 'react-router';

function HomePage() {
  const [settingForm, setSettingForm] = useState(false)
  const [searchText, setSearchText] = useState("");

  const user = useUserStore(st=>st.user)
  const interests = useUserStore(st=>st.interests)
  const getUserInterest = useUserStore(st=>st.getUserInterest)
  const activities = useActivityStore((state) => state.activities) || [];
  const getAllCurrentActivities = useActivityStore((state) => state.getAllCurrentActivities);
  const getActivityByCategory = useActivityStore((state) => state.getActivityByCategory);
  const upcomingActivities = useActivityStore((state) => state.upcomingActivities) || [];
  const getUpcomingActivities = useActivityStore((state) => state.getUpcomingActivities);
  
  
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
    getUserInterest()
  },[interests])
  // console.log('interests', interests)

  useEffect(()=>{
    getUpcomingActivities()
  },[activities])
  // console.log('upcomingActivities', upcomingActivities)


  const [notiOpen, setNotiOpen] = useState(false);
  const [likeOpen, setLikeOpen] = useState(false);
  
  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchText(transcript);
  });

  return (
    <div className="min-h-screen bg-base-200 pb-24">
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

      
        <div className="mt-5 flex overflow-x-auto gap-4 scrollbar-hide -mr-6">
          {upcomingActivities?.length > 0 ? (
            upcomingActivities.map((act) => (
              <NavLink to={`/activity-details?actid=${act.id}`} key={act.id} className="relative w-[280px] shrink-0 snap-start">
                <div className="h-35 rounded-[14px] mb-3 overflow-hidden">
                  <img src={act.coverPhoto} alt="Activity" className='w-full h-full object-cover' />
                </div>
                <p className='absolute top-1 left-1 text-[12px] text-white font-medium bg-primary' >UPCOMING</p> 
                <p className='absolute top-6 left-1 text-white font-bold' >{act.title}</p> 
                <p className='absolute top-12 left-1 text-[12px] text-white font-light' >{act?.place?.placeName}</p> 
                <p className="absolute bottom-4 left-1 text-[14px] text-white font-medium capitalize">
                  {formatRelative(new Date(act.eventStartTime), new Date())}
                </p>
              </NavLink>
            ))
          ) : (
            <div className="h-35 w-full rounded-[14px] mb-3 overflow-hidden border mr-6">
              <p className="text-gray-500 font-light">
                You have no upcoming activities.
              </p>
            </div>
          )}
        </div>

        <pre>{JSON.stringify(interests,null,2)}</pre>

        <div className="mt-6">
          <h3 className='font-bold'>Suggested For You</h3>
          <div className="flex justify-center">
            <div className="bg-amber-300 h-60 w-45 rounded-[14px]">
              mock
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className='font-bold'>Your friend gum lung pai nai</h3>
          <div className="bg-amber-300 h-22 rounded-[14px]">
            friend
          </div>
          <div className="bg-amber-300 h-22 rounded-[14px] mt-2">
            friend
          </div>
        </div>

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