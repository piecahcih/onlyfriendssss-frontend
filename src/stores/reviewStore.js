import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createReviewActivityApi, createReviewUserApi, getActivityRatingsApi, getActivityReviewsApi, getActivityReviewsByLocationApi, getAllActivitiesReviewsApi, getAllReviewsMeApi, getAllUsersReviewsApi, getPlaceRatingsApi, getSpecificReviewApi, getUserApi, getUserRatingsApi } from "../api/mainApi";

const useReviewStore = create(persist((set, get) => ({
  reviews: [],
   selectedUser: null,
   currentReview: null,
   activityRatings: [],
   userRatings: [],
   placeRatings: [],

  getUser: async (userId) => {
    console.log('first',userId)
    const res = await getUserApi(userId);
    console.log('back')
     set({ selectedUser: res.data.user });
     return res;
  },

  // ดึงคะแนนเฉลี่ยต่างๆ
  getActivityRatings: async () => {
   const res = await getActivityRatingsApi();
  set({ activityRatings: res.data });
   return res;
   },
  getUserRatings: async () => {
  const res = await getUserRatingsApi();
   set({ userRatings: res.data });
    return res;
   },
  getPlaceRatings: async () => {
   const res = await getPlaceRatingsApi();
   set({ placeRatings: res.data });
   return res;
  },

  getAllUsersReviews: async () => {
    const res = await getAllUsersReviewsApi()
    set({ reviews: res.data.reviews })
  },
  getAllReviewsMe: async () => {
    const res = await getAllReviewsMeApi()
    set({ reviews: res.data.reviews })
  },

  getAllActivitiesReviews: async () => {
    const res = await getAllActivitiesReviewsApi()
    set({ reviews: res.data.reviews })
  },
  getActivityReviews: async (actid) => {
    const res = await getActivityReviewsApi(actid)
    set({ reviews: res.data.reviews })
  },
  getActivityReviewsByLocation: async (placeid) => {
    const res = await getActivityReviewsByLocationApi(placeid)
    set({ reviews: res.data.reviews })
  },
  getSpecificReview: async (reviewid) => {
    const res = await getSpecificReviewApi(reviewid)
    set({ currentReview: res.data.reviews })
  },

  createReviewActivity: async (actid, body) => {
    const res = await createReviewActivityApi(actid, body)
    return res
  },
  createReviewUser: async (actid, receiverid, body) => {
    const res = await createReviewUserApi(actid, receiverid, body)
    return res
  },

}), { name: 'OFsssReviewState', storage: createJSONStorage(() => localStorage) }))

export default useReviewStore;