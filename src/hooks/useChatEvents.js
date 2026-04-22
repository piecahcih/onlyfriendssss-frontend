import { useEffect } from 'react';
import useSocketStore from '../stores/socketStore';
import useChatStore from '../stores/chatStore';

export const useChatEvents = () => {
    const { socket } = useSocketStore();
    const { addMessage } = useChatStore();

    useEffect(() => {
        if (!socket) return;

        // ดักฟังข้อความใหม่
        socket.on("new_message", (message) => {
            console.log("📩 New message received:", message);
            addMessage(message); // ส่งไปเก็บใน chatStore
        });

        // ดักฟังเมื่อมีคนกำลังพิมพ์ (Optional)
        socket.on("user_typing", (data) => {

        });

        // ดักฟังการแจ้งเตือนอื่นๆ
        socket.on("notification", (data) => {

        });

        // Cleanup function
        // เลิกดักฟังทุกอย่างเ
        return () => {
            socket.off("new_message");
            socket.off("user_typing");
            socket.off("notification");
        };
    }, [socket, addMessage]);
};

export default useChatEvents; 