import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { googleLoginApi, loginApi ,getProfileApi,editProfileApi,deleteProfileApi } from "../api/mainApi";

const useUserStore = create(persist((set, get) => ({
      user: null,
      token: "",
      rememberMe: false,
      login: async (body) => {
        const res = await loginApi(body);
        set({ token: res.data.token, user: res.data.user });
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
      },

      setUser: (userData) => set({ user: userData }),


      

      // 1. ดึงข้อมูล Profile และอัปเดตลง Store
      getProfile: async () => {
        try {
          const res = await getProfileApi();
          // ปรับการเข้าถึง data ตามโครงสร้าง API ของคุณ
          const userData = res.data.user || res.data; 
          set({ user: userData });
          return res;
        } catch (error) {
          console.error("Store GetProfile Error:", error);
          throw error;
        }
      },

      // 2. แก้ไขข้อมูล Profile (รับเป็น formData สำหรับรูปภาพ)
      updateProfile: async (formData) => {
        try {
          const res = await editProfileApi(formData);
          // อัปเดตข้อมูล user ใน store ทันทีหลังจากแก้สำเร็จ
          const updatedUser = res.data.data || res.data.user || res.data;
          set({ user: updatedUser });
          return res;
        } catch (error) {
          console.error("Store UpdateProfile Error:", error);
          throw error;
        }
      },

      // 3. ลบบัญชีตัวเอง
      deleteProfile: async () => {
        try {
          const res = await deleteProfileApi();
          // เมื่อลบบัญชีสำเร็จ ให้ทำการ logout ออกจากระบบทันที
          get().logout(); 
          return res;
        } catch (error) {
          console.error("Store DeleteProfile Error:", error);
          throw error;
        }
      },
      
    }),{ name: "OFsssUserState", storage: createJSONStorage(() => localStorage) }));

export default useUserStore;
