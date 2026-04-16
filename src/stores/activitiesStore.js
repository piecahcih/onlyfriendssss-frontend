import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { changeActivityStatusApi, createActivityApi, deleteActivityByIdApi, editActivityByIdApi, getActivityByCategoryApi, getActivityByIdApi, getAllActivitiesApi, getAllActivitiesCreatedByThisAccountApi, getAllActivitiesJoinedByThisAccountApi, getAllCurrentActivitiesApi, getAllFinishedActivitiesOnThisAccountApi } from "../api/mainApi";

const useActivityStore = create(persist((set,get)=>({
  activities: [],
  creatingActivity: {},
  setCreatingActivity: (data) => {
    console.log('data:', data)
    set({ creatingActivity: data })
  } , 
  getAllCurrentActivities: async () => {
    const res = await getAllCurrentActivitiesApi()
    set({ activities:res.data.activities })
  },
  getAllActivities: async () => {
    const res = await getAllActivitiesApi()
    set({ activities:res.data.activities })
  },
  getAllFinishedActivitiesOnThisAccount: async () => {
    const res = await getAllFinishedActivitiesOnThisAccountApi()
    set({ activities:res.data.activities })
  },
  getAllActivitiesCreatedByThisAccount: async () => {
    const res = await getAllActivitiesCreatedByThisAccountApi()
    set({ activities:res.data.activities })
  },
  getAllActivitiesJoinedByThisAccount: async () => {
    const res = await getAllActivitiesJoinedByThisAccountApi()
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
  createActivity: async (body) => {
    // console.log('start')
    await createActivityApi(body)
    // console.log('body:',body)
    await get().getAllCurrentActivities()

    set({ creatingActivity: {} })
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