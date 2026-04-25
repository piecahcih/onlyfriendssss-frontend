import React, { useEffect } from 'react'
import useUserStore from '../stores/userStore'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { CloseIcon } from '../icons'
import { toast } from 'react-toastify'
import defaultProfile from '../assets/default-profilepic.jpg'

function Welcome() {
  const user = useUserStore(state => state.user)

  const handleContinue = () => {
    sessionStorage.setItem("hasSeenWelcome", "true")
  }



  return (
    <div className='bg-[#FAFAFA] min-h-screen relative flex flex-col font-sans overflow-hidden'>

      <Link to='/' onClick={handleContinue} className="absolute right-6 top-6 z-50">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='text-on-surface/20 hover:text-on-surface/50 transition-colors'
        >
          <CloseIcon className="w-6" />
        </motion.div>
      </Link>

      <main className="flex-1 flex flex-col items-center justify-center px-10">

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <h1 className="text-[32px] font-medium text-on-surface tracking-tight leading-tight">
            Hello, <span className="font-bold text-primary">{user?.username || 'Friend'}</span>
          </h1>
          <p className="text-on-surface/40 text-[15px] mt-3 font-medium">
            Everything is ready for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="relative"
        >
          <Link to='/' onClick={handleContinue} className="block group">
            <div className="flex flex-col items-center">
              <div className="relative p-1 bg-white rounded-full ">
                <div className="w-32 h-32 rounded-full overflow-hidden border-[6px] border-[#F0F0F0]">
                  <img
                    src={user?.profileImg || defaultProfile}
                    alt="Profile"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-1 right-3 w-6 h-6 bg-green-400 border-4 border-white rounded-full"></div>
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-[18px] font-bold text-on-surface opacity-60">
                  {user?.firstName} {user?.lastName}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <div className="w-1 h-1 rounded-full bg-primary/30"></div>
                  <span className="text-[11px] font-bold text-primary/40 uppercase tracking-[0.2em]">Active Account</span>
                  <div className="w-1 h-1 rounded-full bg-primary/30"></div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

      </main>

      <footer className="px-10 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="max-w-xs mx-auto text-center"
        >
          <Link to='/' onClick={handleContinue}>
            <button className="w-full bg-primary text-white py-4.5 rounded-[22px] font-bold text-[16px] ">
              Get Started
            </button>
          </Link>
        </motion.div>
      </footer>
    </div>
  )
}

export default Welcome
