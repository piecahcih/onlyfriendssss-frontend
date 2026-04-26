import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { googleLoginApi, loginApi, getProfileApi, editProfileApi, deleteProfileApi, getUserInterestApi, getUserSuggestedActivitiesByInterestApi, exploreActivitiesApi } from "../api/mainApi";

const useUserStore = create(persist((set, get) => ({
  user: null,
  interests: [],
  suggests: [],
  token: "",
  rememberMe: false,
  registeringUser: null, //ไว้ใช้สมัครสมาชิก 3 หน้า
  setRegisteringUser: (data) => set({ registeringUser: data }),
  completeRegistration: (userData, token) => set({
    user: userData,
    token: token,
    registeringUser: null // เคลียร์ข้อมูลชั่วคราวทิ้ง
  }),
  login: async (body) => {
    const res = await loginApi(body);
    await set({ token: res.data.token, user: res.data.user });
    return res;
  },
  loginWithGoogle: async (idToken, userData) => {
    const res = await googleLoginApi(idToken, userData);
    set({ token: res.data.token, user: res.data.user });
    return res;
  },
  logout: () => {
    set({ token: "", user: null });
    localStorage.removeItem("OFsssUserState");
    sessionStorage.removeItem("hasSeenWelcome");
  },
  
  setUser: (userData) => set({ user: userData }),
  
  getProfile: async () => {
    try {
      const res = await getProfileApi();
      
      const userData = res.data.user || res.data;
      set({ user: userData });
      return res;
    } catch (error) {
      console.error("Store GetProfile Error:", error);
      throw error;
    }
  },
  
  updateProfile: async (formData) => {
    try {
      const res = await editProfileApi(formData);
      
      const updatedUser = res.data.data || res.data.user || res.data;
      set({ user: updatedUser });
      return res;
    } catch (error) {
      console.error("Store UpdateProfile Error:", error);
      throw error;
    }
  },
  
  deleteProfile: async () => {
    try {
      const res = await deleteProfileApi();
      
      get().logout();
      return res;
    } catch (error) {
      console.error("Store DeleteProfile Error:", error);
      throw error;
    }
  },

  getUserInterest: async () => {
    const res = await getUserInterestApi()
    console.log('intereststore', res)

    set({ interests: res.data.interests })
  },
  getUserSuggestedActivitiesByInterest: async () => {
    const res = await getUserSuggestedActivitiesByInterestApi()
    console.log('suggestactstore', res)

    set({ suggests: res.data.suggests })
  },
  exploreActivities: async () => {
    const res = await exploreActivitiesApi()
    console.log('exploreactstore', res)

    set({ suggests: res.data.suggests })
  },
  

}), { name: "OFsssUserState", storage: createJSONStorage(() => localStorage) }));

export default useUserStore;
