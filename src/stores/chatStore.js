import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getChatRoomsApi, getChatHistoryApi, markChatAsReadApi } from "../api/mainApi";

const useChatStore = create(
  persist(
    (set, get) => ({
      rooms: [],
      activeRoomId: null,
      messages: [],
      unreadCounts: {},

      getChatRooms: async () => {

        try {
          const res = await getChatRoomsApi();
          // พยายามแกะข้อมูลจากหลายๆ
          const data = res.data?.data || res.data;
          const roomsArray = data?.rooms || data?.activities || (Array.isArray(data) ? data : []);

          set({ rooms: roomsArray });
          console.log("✅ Rooms loaded into store:", roomsArray);
        } catch (err) {
          console.error("❌ Failed to get chat rooms", err);
          set({ rooms: [] });
        }
      },

      setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

      getChatHistory: async (roomId) => {
        console.log('roomIdforYou', roomId)
        try {

          const res = await getChatHistoryApi(roomId);
          const data = res.data?.data || res.data;
          const messages = data?.messages || (Array.isArray(data) ? data : []);

          set({ messages, activeRoomId: roomId });
          // await get().markAsRead(roomId);
        } catch (err) {
          console.error("❌ Failed to get chat history", err);
        }
      },

      markAsRead: async (roomId) => {
        try {
          await markChatAsReadApi(roomId);
          set((state) => ({
            unreadCounts: { ...state.unreadCounts, [roomId]: 0 }
          }));
        } catch (err) {
          console.error("Failed to mark chat as read", err);
        }
      },

      addMessage: (newMessage) => {
        const { activeRoomId, messages, rooms } = get();

        // 1. อัปเดตรายชื่อห้อง (เพื่อให้ข้อความล่าสุดในลิสต์เปลี่ยน และห้องเด้งขึ้นบน)
        const updatedRooms = rooms.map(room => {
          if (String(room.id) === String(newMessage.roomId)) {
            return { ...room, lastMessage: newMessage };
          }
          return room;
        });
        set({ rooms: updatedRooms });

        // 2. อัปเดตเนื้อหาในห้องแชท หรือ เพิ่มเลข Unread
        if (activeRoomId && String(newMessage.roomId) === String(activeRoomId)) {
          set({ messages: [...messages, newMessage] });
        } else {
          set((state) => ({
            unreadCounts: {
              ...state.unreadCounts,
              [newMessage.roomId]: (state.unreadCounts[newMessage.roomId] || 0) + 1
            }
          }));
        }
      },

      clearChat: () => set({ rooms: [], activeRoomId: null, messages: [], unreadCounts: {} }),
    }),
    {
      name: "OFsssChatState",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rooms: state.rooms,
        activeRoomId: state.activeRoomId

      }),
    }
  )
);

export default useChatStore;