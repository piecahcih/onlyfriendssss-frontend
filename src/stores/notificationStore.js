import { create } from 'zustand'

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    showToast: false,
    toastId: 0,

    // เซ็ต notifications ทั้งหมดจาก API
    setNotifications: (notifications) => {
        const unread = Array.isArray(notifications) ? notifications.filter((n) => !n.isRead).length : 0
        set({ notifications: Array.isArray(notifications) ? notifications : [], unreadCount: unread })
    },

    // เพิ่ม notification ใหม่จาก socket
    addNotification: (notification) => {
        set((state) => {
            const newNotifications = [notification, ...state.notifications]
            return {
                notifications: newNotifications,
                unreadCount: newNotifications.filter(n => !n.isRead).length,
                showToast: true,
                toastId: Date.now(),
            }
        })
    },

    // ปิด Toast
    hideToast: () => set({ showToast: false }),

    // mark as read ทีละอัน
    markAsRead: (id) => {
        set((state) => {
            const updated = state.notifications.map((n) =>
                (n.id === id || n._id === id) ? { ...n, isRead: true } : n
            )
            const newCount = updated.filter(n => !n.isRead).length
            console.log(`📍 Marking ${id} as read. New unread count: ${newCount}`)
            return {
                notifications: updated,
                unreadCount: newCount
            }
        })
    },

    // mark all as read
    markAllAsRead: () => {
        set((state) => {
            console.log('📍 Marking all as read. New unread count: 0')
            const updated = state.notifications.map((n) => ({ ...n, isRead: true }))
            return {
                notifications: updated,
                unreadCount: 0,
            }
        })
    },
}))

export default useNotificationStore
