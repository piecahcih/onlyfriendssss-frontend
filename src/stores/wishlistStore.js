import { create } from "zustand";
import { addWishlist, deleteWishlist, getAllWishlist } from "../api/mainApi";



const useWishlistStore = create((set, get) => ({
  wishlist: [],
  currentWishlist: null,
  getAllWishlist: async () => {
    try {
      const resp = await getAllWishlist()
      set({ wishlist: resp.data.wishlistAll || [] })
    } catch (error) {
      console.log(error)
    }
    // return resp
  },
  addWishlist: async (activityId) => {
    const resp = await addWishlist(activityId)
    await get().getAllWishlist()
    return resp
  },
  deleteWishlist: async (activityId) => {
    const resp = await deleteWishlist(activityId)
    await get().getAllWishlist()
    return resp
  }
}))

export default useWishlistStore