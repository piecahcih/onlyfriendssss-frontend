import { create } from "zustand";

import { createJSONStorage, persist } from "zustand/middleware";
import {
  AcceptFriendApi,
  GetFriendListApi,
  SendFriendRequestApi,
  UnfriendApi,
} from "../api/friendApi";

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
          console.error("Fetch friends error:", error);
        }
      },

      //ขอเป็นเพื่อน
      requestFriends: async (targetId) => {
        try {
          const res = await SendFriendRequestApi(targetId);
          return res;
        } catch (error) {
          console.error("Send request error:", error);
        }
      },

      //รับคำขอเพื่อน
      acceptFriend: async (id) => {
        try {
          const res = await AcceptFriendApi(id);
          await get().getFriends();
          return res;
        } catch (error) {
          console.error("Accept error:", error);
        }
      },

      //ลบเพื่อน
      unFriendship: async (id) => {
        try {
          const res = await UnfriendApi(id);
          await get().getFriends();
          return res;
        } catch (error) {
          console.error("Unfriend error:", error);
        }
      },
      clearFriendStore: () => set({ friends: [], requests: [] }),
    }),
    {
      name: "OFsssFriendState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useFriendStore;
