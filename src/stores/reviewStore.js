import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getActivityDetail, getAllActivity, getUserApi, reviewActivity, reviewUser } from "../api/mainApi";

const useReviewStore = create((set, get) => ({
  activitiesWithRating: [],
  activityReviews: [],

  reviewActivity: async (activityId, body) => {
    const res = await reviewActivity(activityId, body)
    await get().getActivityReviewDetails(activityId)
    return res
  },

  reviewUser: async (activityId, receiverId, body) => {
    const res = await reviewUser(activityId, receiverId, body)
    return res
  },

  getUser: async (userId) => {
     const res = await getUserApi(userId);
     set({ selectedUser: res.data.user });
     return res;
  },

}))

export default useReviewStore;