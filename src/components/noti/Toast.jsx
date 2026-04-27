import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useNotificationStore from '../../stores/notificationStore'

const TYPE_CONFIG = {
    FRIEND_REQUEST: { icon: '👋', label: 'friend request' },
    FRIEND_ACCEPTED: { icon: '🤝', label: 'accept as friend' },
    NEW_MESSAGE: { icon: '💬', label: 'New message' },
    GROUP_MESSAGE: { icon: '👥', label: 'Group messages' },
    ACTIVITY_APPROVED: { icon: '🎉', label: 'Approve to join' },
    JOIN_REQUEST: { icon: '📩', label: 'Join request' },
    NEW_REVIEW: { icon: '⭐', label: 'New review' },
}

export function Toast() {
    const { notifications, showToast, hideToast, toastId } = useNotificationStore()
    const latest = notifications[0]

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                hideToast()
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [showToast, hideToast, toastId])

    if (!showToast || !latest) return null

    const config = TYPE_CONFIG[latest.type] || { icon: '🔔', label: 'Notification' }

    return (
        <AnimatePresence>
            {showToast && (
                <motion.div
                    key={latest.id || latest.createdAt}
                    initial={{ opacity: 0, y: -60 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -60 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-6 left-1/2 -translate-x-1/2 z-[999] bg-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 min-w-[280px]"
                >
                    <span className="text-2xl">{config.icon}</span>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-primary uppercase tracking-widest">
                            {config.label}
                        </span>
                        <span className="text-sm text-gray-700 font-medium">{latest.message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}