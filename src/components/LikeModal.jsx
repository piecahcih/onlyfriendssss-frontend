import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { NavLink } from 'react-router'
import { LeftIcon, CalendarIcon, LocationIcon } from '../icons'
import Wishlist from './profile/Wishlist'
import defaultProfile from '../assets/default-profilepic.jpg'
import useWishlistStore from '../stores/wishlistStore'

function LikeModal({ isOpen, onClose }) {
  const wishlist = useWishlistStore(state => state.wishlist)
  const getAllWishlist = useWishlistStore(state => state.getAllWishlist)

  useEffect(() => {
    if (isOpen) {
      getAllWishlist()
    }
  }, [isOpen, getAllWishlist])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[1000] flex flex-col bg-[#F9F9F9]"
        >
          <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-xl px-6 py-5 flex items-center justify-between border-b border-gray-100/50">
            <button
              type="button"
              onClick={onClose}
              className="p-2 -ml-2 "
            >
              <LeftIcon className="w-6 text-on-surface" />
            </button>

            <h1 className="font-black text-[14px] tracking-[0.15em] text-on-surface uppercase opacity-80">
              My Favorites
            </h1>

            <div className="w-10"></div>
          </header>

          <div className="flex-1 overflow-y-auto px-5 py-6 pb-28">
            {!wishlist || wishlist.length === 0 ? (
              <div className="flex flex-col gap-6 items-center justify-center h-[60vh] opacity-20">
                <div className="w-20 h-20 border-2 border-dashed border-on-surface rounded-full flex items-center justify-center">
                  <LocationIcon className="w-10" />
                </div>
                <p className="font-bold text-[10px] uppercase tracking-[0.2em]">Gallery Empty</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {wishlist.map((item, idx) => {
                  const activity = item.activity
                  if (!activity) return null

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id}
                    >
                      <NavLink
                        to={`/activity-details?actid=${activity.id}`}
                        className="block group"
                        onClick={onClose}
                      >
                        <div className="relative flex gap-3.5 bg-white p-3.5 rounded-[16px] ">

                          <div className="relative w-24 h-24 shrink-0 rounded-[14px] overflow-hidden shadow-inner">
                            <img
                              src={activity?.coverPhoto || "/placeholder-activity.jpg"}
                              alt={activity.title}
                              className="w-full h-full object-cover "
                            />
                          </div>

                          <div className="flex-1 flex flex-col justify-center py-1">
                            <div className="space-y-1.5 pr-8">
                              <h3 className="text-[16px] font-bold text-primary leading-tight tracking-tight">
                                {activity.title}
                              </h3>

                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-on-surface/40">
                                  <CalendarIcon className="w-3.5" />
                                  <span className="text-[10px] font-bold uppercase tracking-tighter italic">
                                    {activity.eventStartTime ? format(new Date(activity.eventStartTime), 'eee, dd MMM • p') : 'TBD'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-on-surface/40">
                                  <LocationIcon className="w-3.5" />
                                  <span className="text-[10px] font-bold truncate max-w-[150px]">
                                    {activity.place?.placeName}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className="absolute top-7 right-2 bg-gray-50/50 p-1 rounded-full backdrop-blur-sm"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          >
                            <div className="scale-95 origin-center">
                              <Wishlist activityId={activity.id} />
                            </div>
                          </div>
                        </div>
                      </NavLink>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LikeModal
