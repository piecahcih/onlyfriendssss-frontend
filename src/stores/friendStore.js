import { create } from "zustand";
import {
  AcceptFriendApi,
  GetFriendActivitiesApi,
  GetFriendListApi,
  SendFriendRequestApi,
  UnfriendApi,
} from "../api/mainApi";
import { createJSONStorage, persist } from "zustand/middleware";

const useFriendStore = create(persist((set, get) => ({
      friends: [],
      requests: [],
      sentRequests: [],
      friendActivities: [],

      //ดึงข้อมูลเพื่อน
      getFriends: async () => {
        try {
          const res = await GetFriendListApi();
          set({
            friends: res.data.friends || [],
            requests: res.data.requests || [],
            sentRequests: res.data.sentRequests || [],
          });
        } catch (error) {
          console.error("Fetch friends error:", error);
        }
      },

      getFriendActivities: async () => {
        try {
          const res = await GetFriendActivitiesApi();
          set({ friendActivities: res.data || [] });
        } catch (error) {
          console.error("Fetch friend activities error:", error);
        }
      },

      //ขอเป็นเพื่อน
      requestFriend: async (targetId) => {
        try {
          const res = await SendFriendRequestApi(targetId);
          await get().getFriends();
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
      clearFriendStore: () => set({ friends: [], requests: [], sentRequests: [] }),
    }),
  {
    name: "olfssssFriendState",
    storage: createJSONStorage(() => localStorage),
  },
),
);

export default useFriendStore;
