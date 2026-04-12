import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { googleLoginApi, loginApi } from "../api/mainApi";

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
    }),{ name: "OFsssUserState", storage: createJSONStorage(() => localStorage) },),);

export default useUserStore;
