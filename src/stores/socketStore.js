import { create } from 'zustand'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3999";

const useSocketStore = create((set, get) => ({
    socket: null,
    isConnected: false,

    connectSocket: (token) => {

        if (get().socket?.connected) return;


        const socket = io(SOCKET_URL, {
            auth: { token },
            reconnection: true,
            transports: ['websocket'],
        });


        socket.on("connect", () => {
            set({ isConnected: true });
            console.log("✅ Socket connected!");
        });

        socket.on("disconnect", () => {
            set({ isConnected: false });
            console.log("❌ Socket disconnected");
        });


        set({ socket });


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