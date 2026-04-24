import React, { useEffect } from 'react'
import { HeartIcon, HeartLineIcon } from '../../icons'
import useWishlistStore from '../../stores/wishlistStore'

function Wishlist({ activityId }) {
  const wishlist = useWishlistStore(state => state.wishlist)
  const addWishlist = useWishlistStore(state => state.addWishlist)
  const deleteWishlist = useWishlistStore(state => state.deleteWishlist)

  useEffect(() => {
    useWishlistStore.getState().getAllWishlist()
  }, [])

  const isFavorite = wishlist.some(item => item.activityId === activityId)

  const handleToggleLike = async (e) => {
    e.preventDefault()

    if (isFavorite) {
      await deleteWishlist(activityId)
    } else {
      await addWishlist(activityId)
    }
  }

  return (
    <button
      onClick={handleToggleLike}
      className="absolute top-4 right-4 p-1.5 rounded-full bg-white/90 text-primary shadow-lg active:scale-90 transition-transform z-10"
    >
      {isFavorite ? (
        <HeartIcon className="h-[20px] ml-auto text-red-500" />
      ) : (
        <HeartLineIcon className="h-[20px] ml-auto text-neutral opacity-80" />
      )}
    </button>
  )
}

export default Wishlist
