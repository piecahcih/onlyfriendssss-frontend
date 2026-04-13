import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { changeActivityStatusApi, createActivitiesApi, deleteActivityByIdApi, editActivityByIdApi, getActivityByCategoryApi, getActivityByIdApi, getAllActivitiesApi, getAllActivitiesCreatedByThisAccountApi } from "../api/mainApi";

const useActivityStore = create(persist((set,get)=>({
  activities: [],
  getAllActivities: async () => {
    const res = await getAllActivitiesApi()
    set({ activities:res.data.activities })
  },
  getAllActivitiesCreatedByThisAccount: async () => {
    const res = await getAllActivitiesCreatedByThisAccountApi()
    set({ activities:res.data.activities })
  },
  getActivityById: async (activityid) => {
    const res = await getActivityByIdApi(activityid)
    set({ activities:res.data.activities })
  },
  getActivityByCategory: async (category) => {
    const res = await getActivityByCategoryApi(category)
    // console.log('res', res)

    set({ activities:res.data.activities })
  },
  createActivities: async (body) => {
    const res = await createActivitiesApi(body)
    set({ activities:res.data.activities })
  },
  editActivityById: async (activityid,body) => {
    const res = await editActivityByIdApi(activityid,body)
    set({ activities:res.data.activities })
  },
  changeActivityStatus: async (activityid,body) => {
    const res = await changeActivityStatusApi(activityid,body)
    set({ activities:res.data.activities })
  },
  deleteActivityById: async (activityid) => {
    const res = await deleteActivityByIdApi(activityid)
    return res
  },

}), { name: 'OFsssActivityState', storage: createJSONStorage(() => localStorage) }))

export default useActivityStore