import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useUserStore = create(persist((set,get)=>({
  user: null,
  token: '',
  rememberMe: false,
  logout: () => {
    set({ token: '', user: null})
    localStorage.removeItem('userState')
  }

}), { name: 'OFsssUserState', storage: createJSONStorage(() => localStorage) }))

export default useUserStore