import { motion, AnimatePresence, useForceUpdate } from 'framer-motion'
import { useNavigate } from 'react-router'
import { LeftIcon, Notification } from '../icons'
import { formatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'
import useNotificationStore from '../stores/notificationStore'
import useUserStore from '../stores/userStore'
import useChatStore from '../stores/chatStore'
import { markAsReadApi, markAllAsReadApi } from '../api/mainApi'
import useFriendStore from '../stores/friendStore'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3999'

const TYPE_CONFIG = {
    FRIEND_REQUEST: { icon: '👋', label: 'friend request', path: '/friendlist' },
    FRIEND_ACCEPTED: { icon: '🤝', label: 'accept as friend', path: '/friendlist' },
    NEW_MESSAGE: { icon: '💬', label: 'New message', path: '/chat' },
    GROUP_MESSAGE: { icon: '👥', label: 'Group messages', path: '/chat' },
    ACTIVITY_APPROVED: { icon: '🎉', label: 'Approve to join', path: '/activities' },
    JOIN_REQUEST: { icon: '📩', label: 'Join request', path: '/activities' },
    REQUEST_TO_JOIN: { icon: '📩', label: 'Join request', path: '/activities' },
    NEW_REVIEW: { icon: '⭐', label: 'New review', path: '/profile' },
}

function NotificationModal({ isOpen, onClose }) {
    const navigate = useNavigate()
    const token = useUserStore((state) => state.token)
    const { notifications, markAsRead, markAllAsRead } = useNotificationStore()
    const rooms = useChatStore((state) => state.rooms);
    const friends = useFriendStore((state)=> state.friends)

    console.log('friends', friends)

    const handleMarkAllRead = async () => {
        try {
            await markAllAsReadApi()
            markAllAsRead()
        } catch (error) {
            console.error(error)
        }
    }


    const handleNotiClick = (noti) => {
        const notiId = noti.id || noti._id;

        // 1. Update UI immediately
        if (!noti.isRead) {
            markAsRead(notiId);
            // Sync with backend in background (no await)
            markAsReadApi(notiId).catch(err => console.error("Backend sync failed:", err));
        }

        onClose(); // Close modal immediately

        const targetId = noti.roomId || noti.refId || noti.activityId;

        // 3. Navigate immediately
        switch (noti.type) {
            case "NEW_MESSAGE":
            case "GROUP_MESSAGE":
                const chatRoom = rooms.find(room => String(room.id) === String(targetId));
                navigate(targetId ? `/chat/${targetId}` : "/chat", {
                  state: {
                    roomId: targetId,
                    title: chatRoom?.name || 'Unknown Chat', // Use chat room name
                    icon: chatRoom?.image || '' // Use chat room image
                  }
                });
                break;

            case "NEW_REVIEW":
                navigate("/reviews-rating"); // Assuming reviews-rating lists user's reviews
                break;

            case "FRIEND_REQUEST":
            case "FRIEND_ACCEPTED":
                const senderId = noti.senderId;
                if (senderId) {
                  navigate(`/friend-profile?userId=${senderId}`);
                } else {
                  navigate("/friendlist");
                }
                break;

            case "ACTIVITY_APPROVED":
            case "JOIN_REQUEST":
            case "REQUEST_TO_JOIN":
                // For activity-related notifications, navigate to activity details
                navigate(targetId ? `/activity-details?actid=${targetId}` : "/activities");
                break;

            default:
                const config = TYPE_CONFIG[noti.type];
                if (config?.path) {
                    navigate(config.path);
                }
                break;
        }
    };


    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed inset-0 z-50 flex flex-col bg-base-200">

                    <header className="w-full top-0 sticky z-40 bg-base-200 shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center justify-between px-6 py-4 relative">
                        <button type='button' onClick={onClose}
                            className="text-[#a83100] hover:opacity-80 active:scale-95 transition-transform duration-200 relative z-10">
                            <LeftIcon className='w-8' />
                        </button>
                        <h1 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 tracking-[-0.02em] font-bold text-[20px] whitespace-nowrap">
                            Notifications
                        </h1>
                        {notifications.length > 0 && (
                            <button onClick={handleMarkAllRead}
                                className="text-xs text-primary font-bold">
                                Mark all as read
                            </button>
                        )}
                    </header>

                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                        {notifications.length === 0 ? (
                            // Empty state เหมือนเดิม
                            <div className="flex flex-col gap-3 items-center justify-center mt-40">
                                <Notification className='w-20 text-secondary/75' />
                                <h1 className='font-bold text-[18px]'>You don't have any notification!</h1>
                            </div>
                        ) : (
                            // แสดง list
                            notifications.map((noti) => {
                                const config = TYPE_CONFIG[noti.type] || { icon: '🔔', label: 'Notification' }
                                return (
                                    <div
                                        key={noti.id || noti._id}
                                        onClick={() => handleNotiClick(noti)}
                                        className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all
                                            ${noti.isRead ? 'bg-white/60' : 'bg-white shadow-sm border border-primary/10'}`}
                                    >
                                        <div className="text-2xl w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-black text-primary uppercase tracking-widest">
                                                {config.label}
                                            </p>
                                            <p className="text-sm text-gray-700 font-medium">{noti.message}</p>
                                            <p className="text-[10px] text-gray-400 mt-1">
                                                {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true, locale: enUS })}
                                            </p>
                                        </div>
                                        {!noti.isRead && (
                                            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NotificationModal