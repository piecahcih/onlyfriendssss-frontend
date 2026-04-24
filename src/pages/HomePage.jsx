import React, { useEffect, useState } from 'react'
import PremiumModal from '../components/ads/PremiumModal'
import { HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { useSpeechToText } from '../hooks/useSpeechToText';
import useActivityStore from '../stores/activitiesStore';
import NotificationModal from '../components/NotificationModal';
import LikeModal from '../components/LikeModal';

function HomePage() {
  const [settingForm, setSettingForm] = useState(false)
  const [searchText, setSearchText] = useState("");

  const activities = useActivityStore((state) => state.activities) || [];
  const getAllCurrentActivities = useActivityStore((state) => state.getAllCurrentActivities,);
  const getActivityByCategory = useActivityStore((state) => state.getActivityByCategory,);

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
            <h1 className='font-bold text-[20px]'>Hello, Peach</h1>
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


        <div className="mt-4">
          {/* <h3 className='font-bold'>Upcoming Activities</h3> */}
          <div className="bg-amber-300 h-35 rounded-[14px]">
            Upcoming Activities
          </div>
        </div>

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