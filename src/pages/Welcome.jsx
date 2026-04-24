import React, { useEffect, useState } from 'react'
import useUserStore from '../stores/userStore'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import Premium from '../components/ads/Premium'
import { CloseIcon, WelcomeIcon } from '../icons'
import { toast } from 'react-toastify'

function Welcome() {
  const user = useUserStore(state => state.user)
  const [settingForm, setSettingForm] = useState(false)
  const navigate = useNavigate()

  const handleContinue = () => {
    sessionStorage.setItem("hasSeenWelcome", "true")
  }

  useEffect(() => {
    if (user) {
      toast.success('Login Success')
    }
  }, [])

  return (
    <div className='bg-base-200 min-h-screen relative'>
      <Link to='/' onClick={handleContinue}>
        <div className='w-8 h-8 absolute right-4 top-3'>
          <CloseIcon />
        </div>
      </Link>
      <div className="flex flex-col items-center justify-between min-h-screen p-6 font-sans">

        <div className="flex-1 flex flex-col items-center text-center mt-5">
          <div className="mb-6">
            <WelcomeIcon />
          </div>

          <h1 className="text-3xl font-black leading-tight mb-2 tracking-tight">
            welcome to <br /> onlyfriendssss
          </h1>
          <p className="text-gray-600 text-sm font-medium mb-12">
            find friends, travel & see the world
          </p>

          <Link to='/' onClick={handleContinue}>
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
          <Link to='/' onClick={handleContinue}>
            <button className="w-full bg-[#FF7B4C] hover:bg-[#ff6a33] text-white py-4 rounded-full font-bold text-lg transition-colors shadow-lg">
              Continue
            </button>
            <div className="w-32 h-1 bg-black rounded-full mx-auto mt-6 opacity-20"></div>
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Welcome