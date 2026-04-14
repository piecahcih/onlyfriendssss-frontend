import { useEffect, useState } from 'react'
import { SearchIcon, MicIcon, Notification } from '../icons'
import mockActImg from '../assets/mockActImg.jpg'
import defaultProfile from '../assets/default-profilepic.jpg'
import useActivityStore from '../stores/activitiesStore';
import {format} from 'date-fns'
import NotificationModal from '../components/NotificationModal';

function Activities() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const categoryList = [
        { id: "all", title: "All", icon: "✨" },
        { id: "health", title: "Health & Wellness", icon: "💪" },
        { id: "entertainment", title: "Chill & Hangout", icon: "🎭" },
        { id: "art", title: "Creative", icon: "🎨" },
        { id: "food", title: "Foodies", icon: "🍱" },
        { id: "travel", title: "Travel", icon: "✈️" }
    ];

    const activities = useActivityStore(st=>st.activities)
    const getAllCurrentActivities = useActivityStore(st=>st.getAllCurrentActivities)
    const getActivityByCategory = useActivityStore(st=>st.getActivityByCategory)

    useEffect(()=>{
        selectedCategory === 'all' ? getAllCurrentActivities()
        :getActivityByCategory(selectedCategory);
        // console.log('selectedCategory:', selectedCategory)
        console.log('activities', activities)
    },[selectedCategory])


    const filteredActivities = selectedCategory === "all" 
        ? activities 
        : activities.filter(act => act.category === selectedCategory.toUpperCase());

    const [notiOpen, setNotiOpen] = useState(false)

    return (
        <div className="min-h-screen bg-base-200 pb-24">
            <main className="pt-8 px-6 max-w-2xl mx-auto">
                {/* Search Bar Section */}
                <div className="flex items-center justify-between gap-2">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 text-on-surface/40" />
                        </div>
                        <input
                            className="w-full bg-white border-none outline-none ring-2 ring-[#e09c99]/20 focus:ring-primary py-3 pl-14 pr-14 rounded-full font-body text-lg shadow-[0_4px_24px_rgba(78,33,32,0.04)] transition-all placeholder:text-on-surface/40"
                            placeholder="Find your vibe..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <MicIcon className="w-6 text-on-surface/40" />
                        </div>
                    </div>
                    <button type='button' onClick={()=>setNotiOpen(true)} className="relative p-4 w-fit h rounded-full bg-white ring-2 ring-[#e09c99]/20 shadow-sm active:scale-95 transition-all">
                        <Notification className="w-6 h-6" />
                        <span className="absolute top-2 right-2 w-5 h-5 bg-primary flex items-center justify-center text-[10px] font-bold text-white border-2 border-white rounded-full">1</span>
                    </button>
                </div>


                {/* Categories Horizontal Scroll */}
                <section className="space-y-4 my-4">
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {categoryList.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`shrink-0 px-5 py-1.5 rounded-3xl font-medium text-sm flex items-center gap-2 transition-all duration-300 active:scale-95
                                    ${selectedCategory === cat.id 
                                        ? "bg-primary text-white shadow-[0_8px_12px_rgba(252,81,0,0.3)]" 
                                        : "bg-white text-on-surface/60 hover:bg-white/80 shadow-sm"}`}
                            >
                                <span className="text-lg">{cat.icon}</span>
                                {cat.title}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Activity Cards List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-headline font-bold text-xl text-on-surface">Trending now</h2>
                        {/* <button className="text-primary font-bold text-sm hover:underline">See all</button> */}
                    </div>

                    <div className="space-y-6">
                        {filteredActivities.map((activity) => (
                            <div key={activity.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300 group">
                                <div className="relative h-48 w-full overflow-hidden">
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
                                    <button className="absolute bottom-4 right-4 p-3 rounded-full bg-white text-primary shadow-lg active:scale-90 transition-transform">
                                        <SearchIcon className="w-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <h3 className="font-headline font-bold text-2xl text-on-surface group-hover:text-primary transition-colors">
                                            {activity.title}
                                        </h3>
                                    </div>

                                    <div className="flex flex-col gap-2.5">
                                        <div className="flex items-center gap-3 text-on-surface/60">
                                            <span className="text-xl">📅</span>
                                            <span className="text-sm font-medium">{format(new Date(activity.eventStartTime), 'eee, dd MMM yyyy • p')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-on-surface/60">
                                            <span className="text-xl">📍</span>
                                            <span className="text-sm font-medium">{activity.place?.placeName}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3.5 items-center">
                                                {[...Array(3)].map((_, i) => (
                                                    <img 
                                                        key={i}
                                                        src={defaultProfile} 
                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                                                        alt="attendee" 
                                                    />
                                                ))}
                                                <div className=" w-10 h-6 rounded-full bg-[#ffccb5] border-2 border-white bg-surface-container-high flex items-center justify-center text-[12px] font-bold text-on-surface/60">
                                                    19
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">Hosted by</span>
                                                <span className="text-sm font-bold">{activity.host.username}</span>
                                            </div>
                                        </div>
                                        
                                        <button className="px-4 py-3 rounded-full bg-linear-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_8px_24px_rgba(252,81,0,0.2)] active:scale-95 transition-all">
                                            Join
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <NotificationModal isOpen={notiOpen} onClose={()=>setNotiOpen(false)} />
        </div>
    )
}

export default Activities