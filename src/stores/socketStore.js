import { create } from 'zustand'
import { createSocketInstance } from '../socket/socket'

const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,

    // ฟังก์ชันเริ่มเชื่อมต่อ
    connectSocket: (token) => {
        const currentSocket = get().socket;

        // 1. ถ้ามี socket อยู่แล้ว
        if (currentSocket) {
            if (!currentSocket.connected) {
                console.log("🔄 Attempting to reconnect existing socket...");
                currentSocket.connect();
            }
            return;
        }

        // 2. ถ้ายังไม่มี ให้สร้างใหม่
        console.log("📡 Creating new socket connection...");
        const socket = createSocketInstance(token);

        socket.on("connect", () => {
            set({ isConnected: true });
            console.log("✅ Socket connected! ID:", socket.id);
        });

        socket.on("disconnect", (reason) => {
            set({ isConnected: false });
            console.log("❌ Socket disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket Connection Error:", err.message);
            set({ isConnected: false });
        });

        set({ socket });
        socket.connect();
    },

    // ฟังก์ชันตัดการเชื่อมต่อ (เรียกใช้ตอน Logout)
    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    },
}));

export default useSocketStore;