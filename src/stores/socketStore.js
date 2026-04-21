import { create } from 'zustand'
import { createSocketInstance } from '../socket/socket'

const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,

    connectSocket: (token) => {
        //ถ้าเชื่อมต่ออยู่แล้ว ไม่ต้องทำซ้ำ
        if (get().socket?.connected) return;

        //ใช้ config จาก socket.js
        const socket = createSocketInstance(token);

        socket.on("connect", () => {
            set({ isConnected: true });
            console.log("✅ Socket connected!");
        });

        socket.on("disconnect", (reason) => {
            set({ isConnected: false });
            console.log("❌ Socket disconnected:", reason);
        });

        // เก็บ instance ไว้ใน store
        set({ socket });

        // เริ่มเชื่อมต่อ
        socket.connect();
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));

export default useSocketStore;