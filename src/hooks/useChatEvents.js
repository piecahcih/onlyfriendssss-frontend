import { useEffect } from 'react';
import useSocketStore from '../stores/socketStore';
import useChatStore from '../stores/chatStore';
import useNotificationStore from '../stores/notificationStore';
import useUserStore from '../stores/userStore'

export const useChatEvents = () => {
    const socket = useSocketStore((state) => state.socket);
    const isConnected = useSocketStore((state) => state.isConnected);

    const { addMessage } = useChatStore();
    const { addNotification } = useNotificationStore();

    useEffect(() => {
        // ✅ รอให้ทั้ง socket และ isConnected พร้อมก่อน
        if (!socket || !isConnected) return;

        console.log("🎧 Registering socket listeners...");

        const handleNewMessage = (message) => {
            console.log("📩 New message received in useChatEvents:", message);

            // ✅ อ่านจาก getState() เพื่อให้ได้ค่าปัจจุบันเสมอ ไม่ใช่ stale closure
            const currentActiveRoomId = useChatStore.getState().activeRoomId;

            addMessage(message);
            const currentUserId = useUserStore.getState().user?.id
            if (Number(message.roomId) !== Number(currentActiveRoomId) && Number(message.sender.id) !== Number(currentUserId)) {
                addNotification({
                    id: message.id,
                    type: 'NEW_MESSAGE',  // เปลี่ยนจาก 'new_message' เป็น 'NEW_MESSAGE'
                    message: `${message.sender.username}: ${message.content}`,
                    roomId: message.roomId,
                    isRead: false,         // เพิ่มบรรทัดนี้
                    createdAt: message.createdAt
                })
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