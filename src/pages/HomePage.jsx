import React, { useEffect, useState } from 'react'
import PremiumModal from '../components/ads/PremiumModal'
import { HeartIcon, MicIcon, Notification, SearchIcon } from '../icons';
import { useSpeechToText } from '../hooks/useSpeechToText';

function HomePage() {
  const [settingForm, setSettingForm] = useState(false)
  const [searchText, setSearchText] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);

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
  
  const { isListening, toggleListening, isSupported } = useSpeechToText((transcript) => {
    setSearchText(transcript);
    setSuggestOpen(true);
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
              onClick={() => setNotiOpen(true)}
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

          <div className="relative group mt-3">
            <div className="absolute inset-y-0 left-5 z-10 flex items-center pointer-events-none">
              <SearchIcon className="w-5 text-neutral" />
            </div>
            <input
              className="w-full bg-white/95 backdrop-blur-md border-none outline-none ring-2 ring-primary/10 focus:ring-primary py-2 pl-14 pr-14 rounded-full shadow-md text-gray-700 transition-all placeholder:text-gray-400"
              placeholder="Find your vibe..."
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onFocus={() => setSuggestOpen(true)}
              onBlur={() => setTimeout(() => setSuggestOpen(false), 200)}
            />
            {isSupported && (
              <div
                className="absolute inset-y-0 right-5 flex items-center z-10 cursor-pointer"
                onClick={toggleListening}
              >
                <MicIcon
                  className={`w-6 transition-all duration-300 ${isListening ? "text-red-500 animate-pulse scale-110" : "text-gray-400 hover:text-primary"
                    }`}
                />
              </div>
            )}

            {suggestOpen &&
              searchText.length > 0 &&
              (activitySuggestions.length > 0 ||
                locationSuggestions.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[30px] shadow-2xl z-50 overflow-hidden border border-primary/5 max-h-125 overflow-y-auto">
                  {activitySuggestions.length > 0 && (
                    <>
                      <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5">
                        Activities
                      </div>
                      {activitySuggestions.map((act) => (
                        <div
                          key={`act-${act.id}`}
                          onClick={() => {
                            setSearchText(act.title);
                            setSuggestOpen(false);
                          }}
                          className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-on-surface font-bold text-sm">
                              {act.title}
                            </span>
                            <span className="text-[9px] text-on-surface/40 uppercase font-black">
                              {act.category}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {locationSuggestions.length > 0 && (
                    <>
                      <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5 border-t border-gray-50">
                        Locations
                      </div>
                      {locationSuggestions.map((placeName) => (
                        <div
                          key={`loc-${placeName.id}`}
                          onClick={() => {
                            setSearchText(placeName);
                            setSuggestOpen(false);
                          }}
                          className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-none transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="text-on-surface font-bold text-sm">
                              {placeName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

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



      <PremiumModal
        isOpen={settingForm}
        onClose={() => setSettingForm(false)}
      />
    </div>
  )
}

export default HomePage