import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useActivityStore = create(persist((set,get)=>({
  activities: null,

}), { name: 'OFsssActivityState', storage: createJSONStorage(() => localStorage) }))

export default useActivityStore