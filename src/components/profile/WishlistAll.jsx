import React, { useEffect } from 'react'
import { format } from 'date-fns'
import { NavLink } from 'react-router'
import Wishlist from './Wishlist'
import { CalendarIcon, LocationIcon } from '../../icons'
import defaultProfile from '../../assets/default-profilepic.jpg'
import useWishlistStore from '../../stores/wishlistStore'

function WishlistAll() {
  const wishlist = useWishlistStore(state => state.wishlist)
  const getAllWishlist = useWishlistStore(state => state.getAllWishlist)


  useEffect(() => {
    getAllWishlist()
  }, [])

  return (
    <>
      {wishlist.map((item) => {
        const act = item.activity

        if (!act) return null

        return (
          <NavLink to={`/activity-details?actid=${act.id}`} key={item.id} className="block mb-6">
            <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300">

              <div className="relative h-50 w-full overflow-hidden">
                <img
                  src={act.coverPhoto}
                  alt={act.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[12px] font-bold text-on-surface">
                    <span>{act.isPublic ? "🌎" : "🔒"}</span>
                    {act.isPublic ? "Public" : "Private"}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-[12px] font-bold text-white">
                    <span>{act.categoryIcon}</span>
                    {act.category}
                  </div>
                </div>

                <Wishlist activityId={act.id} />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                    {act.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 text-on-surface/60">
                    <CalendarIcon className='w-4.5 text-primary' />
                    <span className="text-sm font-medium">
                      {act.eventStartTime ? format(new Date(act.eventStartTime), 'eee, dd MMM yyyy • p') : 'No Date Set'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-on-surface/60">
                    <LocationIcon className='w-4.5 text-primary' />
                    <span className="text-sm font-medium">
                      {act.place?.placeName || 'Location TBD'}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3.5 items-center">
                      {[...Array(3)].map((_, i) => (
                        <img key={i} src={defaultProfile} className="w-10 h-10 rounded-full border-2 border-white object-cover" alt="attendee" />
                      ))}
                      <div className="w-10 h-6 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[12px] font-bold text-on-surface/60">
                        19
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">Hosted by</span>
                    <span className="text-sm font-bold">
                      {act.host?.username || 'Anonymous'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </NavLink>
        )
      })}
    </>
  )
}

export default WishlistAll
