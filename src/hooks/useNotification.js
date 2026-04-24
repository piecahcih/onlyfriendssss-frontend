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
                console.log('Fetching notifications...')
                const res = await getNotificationsApi()
                console.log('Notifications full response:', res.data)

                // รองรับหลายรูปแบบ: res.data.notifications, res.data.data หรือ res.data
                const notiData = res.data.notifications || res.data.data || res.data
                console.log('Extracted notifications:', notiData)

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
            console.log('📡 Socket not found, waiting for connection...')
            return
        }

        console.log('✅ Socket listener for notification attached (ID:', socket.id, ')')

        const handleNotification = (data) => {
            console.log('🔔 RECEIVED NOTIFICATION:', data) // ดูข้อมูลที่ส่งมาจาก Backend
            const { notifications } = useNotificationStore.getState()

            // ป้องกันแจ้งเตือนซ้ำ
            const isDuplicate = notifications.some(n => (n.id === data.id || n._id === data._id))
            if (!isDuplicate) {
                console.log('✨ Adding new notification to store')
                addNotification(data)
            } else {
                console.log('⚠️ Duplicate notification ignored')
            }
        }

        socket.on('notification', handleNotification)
        return () => {
            console.log('❌ Socket listener for notification detached')
            socket.off('notification', handleNotification)
        }
    }, [socket, addNotification])
}