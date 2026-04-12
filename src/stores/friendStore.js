import { create } from "zustand";
import {
  AcceptFriendApi,
  GetFriendListApi,
  SendFriendRequestApi,
  UnfriendApi,
} from "../api/mainApi";
import { createJSONStorage, persist } from "zustand/middleware";

const useFriendStore = create(
  persist(
    (set, get) => ({
      friends: [],
      requests: [],

      //ดึงข้อมูลเพื่อน
      getFriends: async () => {
        try {
          const res = await GetFriendListApi();
          set({
            friends: res.data.friends || [],
            requests: res.data.requests || [],
          });
        } catch (error) {
          console.error("Fetch friends error:", err);
        }
      },

      //ขอเป็นเพื่อน
      requestFriend: async (targetId) => {
        try {
          const res = await SendFriendRequestApi(targetId);
          return res;
        } catch (error) {
          console.error("Send request error:", err);
        }
      },

      //รับคำขอเพื่อน
      acceptFriend: async () => {
        try {
          const res = await AcceptFriendApi(id);
          await get().getFriends();
          return res;
        } catch (error) {
          console.error("Accept error:", err);
        }
      },

      //ลบเพื่อน
      unFriendship: async () => {
        try {
          const res = await UnfriendApi(id);
          await get().getFriends();
          return res;
        } catch (error) {
          console.error("Unfriend error:", err);
        }
      },
      clearFriendStore: () => set({ friends: [], requests: [] }),
    }),
    {
      name: "olfssssFriendState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFriendStore;
