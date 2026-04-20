import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { changeActivityStatusApi, createActivityApi, deleteActivityByIdApi, editActivityByIdApi, getActivityByCategoryApi, getActivityByIdApi, getAllActivitiesApi, getAllActivitiesCreatedByThisAccountApi, getAllActivitiesJoinedByThisAccountApi, getAllCurrentActivitiesApi, getAllFinishedActivitiesOnThisAccountApi, joinActivityApi,manageJoinRequestApi, leaveActivityApi  } from "../api/mainApi";

const useActivityStore = create(persist((set,get)=>({
  activities: [],
  currentActivity: null,
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
    set({ currentActivity: res.data.activities || res.data })
  },
  getActivityByCategory: async (category) => {
    const res = await getActivityByCategoryApi(category)
    // console.log('res', res)

    set({ activities:res.data.activities })
  },

   // --- ฟังก์ชันใหม่สำหรับการ Join และ จัดการคำขอ ---
   joinActivity: async (activityId) => {
     const res = await joinActivityApi(activityId);
     await get().getActivityById(activityId); // รีเฟรชข้อมูลกิจกรรมปัจจุบัน
     return res;
   },
   manageJoinRequest: async (activityId, requestId, status) => {
     const res = await manageJoinRequestApi(requestId, status);
     await get().getActivityById(activityId); // รีเฟรชข้อมูลเพื่ออัปเดตรายชื่อ
     return res;
   },
   leaveActivity: async (activityId) => {
     const res = await leaveActivityApi(activityId);
     await get().getActivityById(activityId);
     return res;
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