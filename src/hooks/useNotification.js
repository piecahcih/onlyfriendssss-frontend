import { useEffect } from 'react'
import useSocketStore from '../stores/socketStore'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'
import { getNotificationsApi } from '../api/mainApi'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3999'

export function useNotification() {
    const socket = useSocketStore((state) => state.socket)
    const token = useUserStore((state) => state.token)
    const { setNotifications, addNotification } = useNotificationStore()

    // ดึง notifications จาก API
    useEffect(() => {
        if (!token) return
        const fetchNotifications = async () => {
            try {
                const res = await getNotificationsApi()

                // รองรับหลายรูปแบบ: res.data.notifications, res.data.data หรือ res.data
                const notiData = res.data.notifications || res.data.data || res.data

                setNotifications(Array.isArray(notiData) ? notiData : [])
            } catch (error) {
                console.error('Failed to fetch notifications:', error)
            }
        }
        fetchNotifications()
    }, [token, setNotifications])

    // รับ notification แบบ real-time จาก socket
    useEffect(() => {
        if (!socket) {
            return
        }

        const handleNotification = (data) => {
            console.log('🔔 Notification received:', data)
            const { notifications } = useNotificationStore.getState();

            const isDuplicate = notifications.some(n =>
                n.type === data.type &&
                n.senderId === data.senderId &&
                n.refId === data.refId
            );

            console.log('isDuplicate:', isDuplicate)

            if (!isDuplicate) {
                addNotification(data);
            }
        };

        socket.on('notification', handleNotification)
        return () => {
            socket.off('notification', handleNotification)
        }
    }, [socket, addNotification])
}