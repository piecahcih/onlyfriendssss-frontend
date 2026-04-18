import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/userStore'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import Premium from '../components/ads/Premium'
import { CloseIcon, WelcomeIcon } from '../icons'
import { toast } from 'react-toastify'

function Welcome() {
  const user = useUserStore(state => state.user)
  const [settingForm, setSettingForm] = useState(false)

  useEffect(() => {
    if (user) {
      toast.success('Login Success')
    }
  }, [])

  const handleSettingOpen = () => {
    setSettingForm(true);
  }

  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="flex flex-col items-center justify-between min-h-screen p-6 font-sans">

        <div className="flex-1 flex flex-col items-center text-center">
          <div className="mb-6">
            <WelcomeIcon />
          </div>

          <h1 className="text-3xl font-black leading-tight mb-2 tracking-tight">
            welcome to <br /> onlyfriendssss
          </h1>
          <p className="text-gray-600 text-sm font-medium mb-12">
            find friends, travel & see the world
          </p>

          <Link to='/lddiscover'>
            <div className="w-full max-w-xs border border-orange-200 rounded-3xl p-4 flex items-center gap-4 bg-white shadow-sm 
                  transition-all duration-300 ease-in-out 
                  hover:shadow-md hover:scale-[1.02] hover:bg-orange-50/30 active:scale-95">
              <div className="w-16 h-16 rounded-full bg-orange-100 overflow-hidden border border-orange-100 shrink-0">
                <img
                  src={user?.profileImg}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="text-left">
                <h2 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-orange-600">
                  {user?.username}
                </h2>
                <p className="text-xs text-gray-400">
                  {user.firstName} , {user.lastName}
                </p>
              </div>
            </div>
          </Link>
          <p className="text-gray-600 text-md font-medium m-4">
            Click on the account to continue
          </p>

        </div>

        <div className="w-full max-w-sm mt-auto mb-4">
          <button onClick={handleSettingOpen} className="w-full bg-[#FF7B4C] hover:bg-[#ff6a33] text-white py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
            Premium
          </button>
          <div className="w-32 h-1 bg-black rounded-full mx-auto mt-6 opacity-20"></div>
        </div>

        <AnimatePresence>
          {settingForm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSettingForm(false)}
                className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-white z-[101] rounded-t-[40px] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">

                <div className="text-center mt-4 mb-">
                  <div className='text-end'>
                    <button onClick={() => setSettingForm(false)} className="text-end p-2 rounded-full hover:bg-gray-200 transition-colors">
                      <CloseIcon className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <h1 className="text-[#FF7B4C] text-3xl font-black mb-6 tracking-tight">
                    onlyfriendssss
                  </h1>
                  <h2 className="text-black text-sm font-bold uppercase tracking-widest leading-relaxed max-w-[250px] mx-auto">
                    MAKE UNLIMITED TRAVEL WITH <br />
                    onlyfriendssss PREMIUM
                  </h2>
                </div>

                <Premium />


              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}

export default Welcome