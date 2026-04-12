import { useState } from 'react'
import { SearchIcon, MicIcon, Notification } from '../icons'
import mockActImg from '../assets/mockActImg.jpg'
import defaultProfile from '../assets/default-profilepic.jpg'

function Activities() {
    const [selectedCategory, setSelectedCategory] = useState("ALL");

    const categoryList = [
        { id: "ALL", title: "All", icon: "✨" },
        { id: "HEALTH", title: "Health", icon: "💪" },
        { id: "ENTERTAINMENT", title: "Entertainment", icon: "🎭" },
        { id: "ART", title: "Art", icon: "🎨" },
        { id: "FOOD", title: "Food", icon: "🍱" },
        { id: "TRAVEL", title: "Travel", icon: "✈️" }
    ];

    const activitiesList = [
        {
            id: 1,
            title: "Morning Run in the Park",
            date: "Sun, 12 Apr 2026",
            time: "07:30 AM",
            location: "Benchakitti Park, Bangkok",
            category: "HEALTH",
            categoryIcon: "💪",
            isPublic: true,
            host: "Sarah",
            attendees: 5,
            image: mockActImg
        },
        {
            id: 2,
            title: "Board Game Night",
            date: "Mon, 13 Apr 2026",
            time: "18:00 PM",
            location: "The Stronghold Cafe",
            category: "ENTERTAINMENT",
            categoryIcon: "🎭",
            isPublic: true,
            host: "Mike",
            attendees: 3,
            image: mockActImg
        },
        {
            id: 3,
            title: "Watercolor Workshop",
            date: "Sat, 18 Apr 2026",
            time: "14:00 PM",
            location: "Art Studio, Silom",
            category: "ART",
            categoryIcon: "🎨",
            isPublic: false,
            host: "Jane",
            attendees: 8,
            image: mockActImg
        }
    ];

    const filteredActivities = selectedCategory === "ALL" 
        ? activitiesList 
        : activitiesList.filter(act => act.category === selectedCategory);

    return (
        <div className="min-h-screen bg-base-200 text-on-surface font-body pb-24">
            <main className="pt-24 px-6 max-w-2xl mx-auto space-y-8">
                {/* Search Bar Section */}
                <div className="flex">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <SearchIcon className="w-5 text-on-surface/40" />
                        </div>
                        <input
                            className="w-full bg-white border-none outline-none ring-2 ring-[#e09c99]/20 focus:ring-primary h-14 pl-14 pr-14 rounded-full font-body text-lg shadow-[0_4px_24px_rgba(78,33,32,0.04)] transition-all placeholder:text-on-surface/40"
                            placeholder="Find your vibe..."
                            type="text"
                        />
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <MicIcon className="w-6 text-on-surface/40" />
                        </div>
                    </div>
                    <button className="relative p-2 rounded-full bg-white shadow-sm active:scale-95 transition-all">
                        <Notification className="w-6 text-primary" />
                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary border-2 border-white rounded-full"></span>
                    </button>
                </div>


                {/* Categories Horizontal Scroll */}
                <section className="space-y-4">
                    <h2 className="font-headline font-bold text-lg text-on-surface/80">Discover categories</h2>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
                        {categoryList.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`flex-shrink-0 px-5 py-2.5 rounded-3xl font-medium text-sm flex items-center gap-2 transition-all duration-300 active:scale-95
                                    ${selectedCategory === cat.id 
                                        ? "bg-primary text-white shadow-[0_8px_20px_rgba(252,81,0,0.3)]" 
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
                        <button className="text-primary font-bold text-sm hover:underline">See all</button>
                    </div>

                    <div className="space-y-6">
                        {filteredActivities.map((activity) => (
                            <div key={activity.id} className="bg-white rounded-[2rem] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300 group">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <img 
                                        src={activity.image} 
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
                                            <span className="text-sm font-medium">{activity.date} • {activity.time}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-on-surface/60">
                                            <span className="text-xl">📍</span>
                                            <span className="text-sm font-medium">{activity.location}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex items-center justify-between border-t border-surface-container-low">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-3">
                                                {[...Array(3)].map((_, i) => (
                                                    <img 
                                                        key={i}
                                                        src={defaultProfile} 
                                                        className="w-10 h-10 rounded-full border-2 border-white object-cover" 
                                                        alt="attendee" 
                                                    />
                                                ))}
                                                <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container-high flex items-center justify-center text-[12px] font-bold text-on-surface/60">
                                                    +{activity.attendees}
                                                </div>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-on-surface/40 font-bold uppercase tracking-wider">Hosted by</span>
                                                <span className="text-sm font-bold">{activity.host}</span>
                                            </div>
                                        </div>
                                        
                                        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-[0_8px_24px_rgba(252,81,0,0.2)] active:scale-95 transition-all">
                                            Join Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Activities