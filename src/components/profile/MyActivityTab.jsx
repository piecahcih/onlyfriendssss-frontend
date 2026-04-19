import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useActivityStore from "../../stores/activitiesStore";
import { NavLink } from "react-router";
import { format } from "date-fns";
import defaultProfile from '../../assets/default-profilepic.jpg'
import { CalendarIcon, HeartIcon, HeartLineIcon, LocationIcon } from "../../icons";

function MyActivityTab() {

    const tabs = ["Joined", "Created", "Memory"];
    const [activeTab, setActiveTab] = useState("Joined");

    const activities = useActivityStore(st => st.activities)
    const getAllFinishedActivitiesOnThisAccount = useActivityStore(st => st.getAllFinishedActivitiesOnThisAccount)
    const getAllActivitiesJoinedByThisAccount = useActivityStore(st => st.getAllActivitiesJoinedByThisAccount)
    const getAllActivitiesCreatedByThisAccount = useActivityStore(st => st.getAllActivitiesCreatedByThisAccount)

    useEffect(() => {
        // getAllActivitiesJoinedByThisAccount()
        const fetchActivities = {
            'Joined': getAllActivitiesJoinedByThisAccount,
            'Created': getAllActivitiesCreatedByThisAccount,
            'Memory': getAllFinishedActivitiesOnThisAccount
        }

        if (fetchActivities[activeTab]) {
            fetchActivities[activeTab]()
        }

        // console.log('selectedCategory:', selectedCategory)
        console.log('activities', activities)
    }, [activeTab])

    const [haveLike, setHaveLike] = useState(false)
    const hdlLikeClick = async (e) => {
        e.preventDefault()
        e.stopPropagation()
    }

    return (
        <div className="">
            <div className="flex border-b border-gray-200 mb-6 relative px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-lg bai-jamjuree-bold transition-all relative z-10 ${activeTab === tab ? "text-primary" : "text-neutral opacity-60"}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="px-6 flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >

                        {activeTab === "Joined" && (activities.length > 0 ? (
                            <div className="space-y-8">
                                {activities.map((activity) => (
                                    <NavLink to={`/activity-details?actid=${activity.id}`} key={activity.id} className="block" >
                                        <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300">

                                            <div className="relative h-50 w-full overflow-hidden">
                                                <img
                                                    src={activity.coverPhoto}
                                                    alt={activity.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[12px] font-bold text-on-surface">
                                                        <span>{activity.isPublic ? "🌎" : "🔒"}</span>
                                                        {activity.isPublic ? "Public" : "Private"}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-[12px] font-bold text-white">
                                                        <span>{activity.categoryIcon}</span>
                                                        {activity.category}
                                                    </div>
                                                </div>

                                                <motion.button whileTap={{ scale: 1.2, transition: { duration: 0.2 } }} onClick={hdlLikeClick} className="absolute bottom-4 right-4 p-2 rounded-full bg-white text-primary shadow-lg active:scale-90 transition-transform">
                                                    {haveLike ? <HeartIcon className="h-[28px] ml-auto" />
                                                        : <HeartLineIcon className="h-[28px] ml-auto text-neutral opacity-80" />}
                                                </motion.button>

                                            </div>

                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                                                        {activity.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col gap-2.5">
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <CalendarIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{format(new Date(activity.eventStartTime), 'eee, dd MMM yyyy • p')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <LocationIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{activity.place?.placeName}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-3.5 items-center">
                                                            {(activity.joinRequests?.filter(req => req.status === 'APPROVED') || [])
                                                                .slice(0, 3)
                                                                .map((attendee, i) => (
                                                                    <img
                                                                        key={attendee.id || i}
                                                                        src={attendee.user?.profileImg ? (attendee.user.profileImg.startsWith('http') ? attendee.user.profileImg : `http://localhost:3999${attendee.user.profileImg}`) : defaultProfile}
                                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                                                        alt="attendee"
                                                                    />
                                                                ))}
                                                            {(() => {
                                                                const approvedCount = activity.joinRequests?.filter(req => req.status === 'APPROVED').length || 0;

                                                                if (approvedCount > 3) {
                                                                    return (
                                                                        <div className=" h-5 px-3 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            +{approvedCount - 3}
                                                                        </div>
                                                                    );
                                                                } else if (approvedCount > 0) {
                                                                    return (
                                                                        <div className=" px-3 h-5 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            {approvedCount}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <span className="text-[10px] font-bold text-on-surface/30 uppercase pl-2 leading-none">
                                                                            No attendees yet
                                                                        </span>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">Hosted by</span>
                                                        <span className="text-sm font-bold text-primary">{activity.host?.username}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>) : (<div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">No events created yet.</div>
                        ))}

                        {activeTab === "Created" && (activities.length > 0 ? (
                            <div className="space-y-8">
                                {activities.map((activity) => (
                                    <NavLink to={`/edit-activity-details?actid=${activity.id}`} key={activity.id} className="block" >
                                        <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300">

                                            <div className="relative h-50 w-full overflow-hidden">
                                                <img
                                                    src={activity.coverPhoto}
                                                    alt={activity.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[12px] font-bold text-on-surface">
                                                        <span>{activity.isPublic ? "🌎" : "🔒"}</span>
                                                        {activity.isPublic ? "Public" : "Private"}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-[12px] font-bold text-white">
                                                        <span>{activity.categoryIcon}</span>
                                                        {activity.category}
                                                    </div>
                                                </div>

                                                <motion.button whileTap={{ scale: 1.2, transition: { duration: 0.2 } }} onClick={hdlLikeClick} className="absolute bottom-4 right-4 p-2 rounded-full bg-white text-primary shadow-lg active:scale-90 transition-transform">
                                                    {haveLike ? <HeartIcon className="h-[28px] ml-auto" />
                                                        : <HeartLineIcon className="h-[28px] ml-auto text-neutral opacity-80" />}
                                                </motion.button>

                                            </div>

                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                                                        {activity.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col gap-2.5">
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <CalendarIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{format(new Date(activity.eventStartTime), 'eee, dd MMM yyyy • p')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <LocationIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{activity.place?.placeName}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-3.5 items-center">
                                                            {(activity.joinRequests?.filter(req => req.status === 'APPROVED') || [])
                                                                .slice(0, 3)
                                                                .map((attendee, i) => (
                                                                    <img
                                                                        key={attendee.id || i}
                                                                        src={attendee.user?.profileImg ? (attendee.user.profileImg.startsWith('http') ? attendee.user.profileImg : `http://localhost:3999${attendee.user.profileImg}`) : defaultProfile}
                                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                                                        alt="attendee"
                                                                    />
                                                                ))}
                                                            {(() => {
                                                                const approvedCount = activity.joinRequests?.filter(req => req.status === 'APPROVED').length || 0;

                                                                if (approvedCount > 3) {
                                                                    return (
                                                                        <div className=" h-5 px-3 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            +{approvedCount - 3}
                                                                        </div>
                                                                    );
                                                                } else if (approvedCount > 0) {
                                                                    return (
                                                                        <div className=" px-3 h-5 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            {approvedCount}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <span className="text-[10px] font-bold text-on-surface/30 uppercase pl-2 leading-none">
                                                                            No attendees yet
                                                                        </span>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                            <button type="button" onClick={'love'}>Edit</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>) : (<div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">No events created yet.</div>
                        ))}

                        {activeTab === "Memory" && (activities.length > 0 ? (
                            <div className="space-y-8">
                                {activities.map((activity) => (
                                    <NavLink to={`/activity-details?actid=${activity.id}`} key={activity.id} className="block" >
                                        <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300">

                                            <div className="relative h-50 w-full overflow-hidden">
                                                <img
                                                    src={activity.coverPhoto}
                                                    alt={activity.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-[12px] font-bold text-on-surface">
                                                        <span>{activity.isPublic ? "🌎" : "🔒"}</span>
                                                        {activity.isPublic ? "Public" : "Private"}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-[12px] font-bold text-white">
                                                        <span>{activity.categoryIcon}</span>
                                                        {activity.category}
                                                    </div>
                                                </div>

                                                <motion.button whileTap={{ scale: 1.2, transition: { duration: 0.2 } }} onClick={hdlLikeClick} className="absolute bottom-4 right-4 p-2 rounded-full bg-white text-primary shadow-lg active:scale-90 transition-transform">
                                                    {haveLike ? <HeartIcon className="h-[28px] ml-auto" />
                                                        : <HeartLineIcon className="h-[28px] ml-auto text-neutral opacity-80" />}
                                                </motion.button>

                                            </div>

                                            <div className="p-6 space-y-4">
                                                <div>
                                                    <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                                                        {activity.title}
                                                    </h3>
                                                </div>

                                                <div className="flex flex-col gap-2.5">
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <CalendarIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{format(new Date(activity.eventStartTime), 'eee, dd MMM yyyy • p')}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-on-surface/60">
                                                        <LocationIcon className='w-4.5 text-primary' />
                                                        <span className="text-sm font-medium">{activity.place?.placeName}</span>
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-3.5 items-center">
                                                            {(activity.joinRequests?.filter(req => req.status === 'APPROVED') || [])
                                                                .slice(0, 3)
                                                                .map((attendee, i) => (
                                                                    <img
                                                                        key={attendee.id || i}
                                                                        src={attendee.user?.profileImg ? (attendee.user.profileImg.startsWith('http') ? attendee.user.profileImg : `http://localhost:3999${attendee.user.profileImg}`) : defaultProfile}
                                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
                                                                        alt="attendee"
                                                                    />
                                                                ))}
                                                            {(() => {
                                                                const approvedCount = activity.joinRequests?.filter(req => req.status === 'APPROVED').length || 0;

                                                                if (approvedCount > 3) {
                                                                    return (
                                                                        <div className=" h-5 px-3 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            +{approvedCount - 3}
                                                                        </div>
                                                                    );
                                                                } else if (approvedCount > 0) {
                                                                    return (
                                                                        <div className=" px-3 h-5 rounded-full bg-[#ffccb5] border-2 border-white flex items-center justify-center text-[11px] font-black text-primary shadow-sm">
                                                                            {approvedCount}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    return (
                                                                        <span className="text-[10px] font-bold text-on-surface/30 uppercase pl-2 leading-none">
                                                                            No attendees yet
                                                                        </span>
                                                                    );
                                                                }
                                                            })()}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">Hosted by</span>
                                                        <span className="text-sm font-bold text-primary">{activity.host?.username}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </NavLink>
                                ))}
                            </div>) : (<div className="p-10 text-center text-neutral opacity-40 bai-jamjuree-medium">No events created yet.</div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default MyActivityTab