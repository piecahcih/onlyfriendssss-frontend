import { useEffect } from 'react';
import useSocketStore from '../stores/socketStore';
import useChatStore from '../stores/chatStore';
import useNotificationStore from '../stores/notificationStore';

export const useChatEvents = () => {
    const socket = useSocketStore((state) => state.socket);           // ✅ selector
    const isConnected = useSocketStore((state) => state.isConnected); // ✅ selector

    const { addMessage } = useChatStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        // ✅ รอให้ทั้ง socket และ isConnected พร้อมก่อน
        if (!socket || !isConnected) return;

        console.log("🎧 Registering socket listeners...");

        const handleNewMessage = (message) => {
            console.log("📩 New message received:", message);

            // ✅ อ่านจาก getState() เพื่อให้ได้ค่าปัจจุบันเสมอ ไม่ใช่ stale closure
            const currentActiveRoomId = useChatStore.getState().activeRoomId;

            addMessage(message);

            if (String(message.roomId) !== String(currentActiveRoomId)) {
                addNotification({
                    id: `msg-${Date.now()}`,
                    type: 'NEW_MESSAGE',
                    message: `${message.sender?.username || 'Friend'}: ${message.content}`,
                    roomId: message.roomId,
                    createdAt: new Date().toISOString(),
                    isRead: false,
                });
            }
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            console.log("🔇 Removing socket listeners...");
            socket.off("new_message", handleNewMessage); // ✅ ระบุ handler ตรงๆ
        };

        // ✅ depend ทั้ง socket และ isConnected
        // ทำให้ register listener ใหม่ทุกครั้งที่ reconnect
    }, [socket, isConnected]);
};

export default useChatEvents;