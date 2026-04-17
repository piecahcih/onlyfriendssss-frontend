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
      
    }),{ name: "OFsssUserState", storage: createJSONStorage(() => localStorage) }));

export default useUserStore;
