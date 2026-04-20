import { useEffect, useState } from 'react'
import { SearchIcon, MicIcon, Notification, CalendarIcon, LocationIcon } from '../icons'
import defaultProfile from '../assets/default-profilepic.jpg'
import useActivityStore from '../stores/activitiesStore';
import { format } from 'date-fns'
import NotificationModal from '../components/NotificationModal';
import { NavLink } from 'react-router';
import Wishlist from '../components/profile/Wishlist';


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

    const activities = useActivityStore(st => st.activities)
    const getAllCurrentActivities = useActivityStore(st => st.getAllCurrentActivities)
    const getActivityByCategory = useActivityStore(st => st.getActivityByCategory)

    const [searchText, setSearchText] = useState("");
    const [suggestOpen, setSuggestOpen] = useState(false);


    useEffect(() => {
        selectedCategory === 'all' ? getAllCurrentActivities()
            : getActivityByCategory(selectedCategory);
        // console.log('selectedCategory:', selectedCategory)
        console.log('activities', activities)
    }, [selectedCategory])

    const activitySuggestions = Array.isArray(activities) ? activities.filter(act =>
        act.title.toLowerCase().includes(searchText.toLowerCase())
    ).slice(0, 3) : [];

    const location = [...new Set(activities.map(act => act.place?.placeName))]

    const locationSuggestions = Array.isArray(activities) ? location.filter(placeName => 
        placeName?.toLowerCase().includes(searchText.toLowerCase())
    ).slice(0, 3) : [];

    // const filteredActivities = selectedCategory === "all" 
    //     ? activities 
    //     : activities.filter(act => act.category === selectedCategory.toUpperCase());

    const filteredActivities = (Array.isArray(activities) ? (selectedCategory === "all"
        ? activities
        : activities.filter(act => act.category === selectedCategory.toUpperCase()))
        : [])
        .filter(act =>
            act.title.toLowerCase().includes(searchText.toLowerCase()) ||
            act.place?.placeName?.toLowerCase().includes(searchText.toLowerCase())
        );



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
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onFocus={() => setSuggestOpen(true)}
                            onBlur={() => setTimeout(() => setSuggestOpen(false), 200)}
                        />

                        {/* Suggestions Modal */}
                        {suggestOpen && searchText.length > 0 && (activitySuggestions.length > 0 || locationSuggestions.length > 0) && (
                            <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[30px] shadow-2xl z-50 overflow-hidden border border-primary/5 max-h-[500px] overflow-y-auto">
                                {activitySuggestions.length > 0 && (
                                    <>
                                        <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5">
                                            Activities
                                        </div>
                                        {activitySuggestions.map((act) => (
                                            <div
                                                key={`act-${act.id}`}
                                                onClick={() => {
                                                    setSearchText(act.title);
                                                    setSuggestOpen(false);
                                                }}
                                                className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 transition-colors">

                                                <div className="flex flex-col">
                                                    <span className="text-on-surface font-bold text-sm">{act.title}</span>
                                                    <span className="text-[9px] text-on-surface/40 uppercase font-black">{act.category}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}

                                {locationSuggestions.length > 0 && (
                                    <>
                                        <div className="px-6 py-3 text-[10px] font-black text-primary/50 uppercase tracking-widest bg-primary/5 border-t border-gray-50">
                                            Locations
                                        </div>
                                        {locationSuggestions.map((placeName) => (
                                            <div
                                                key={`loc-${placeName.id}`} 
                                                onClick={() => {
                                                    setSearchText(placeName);
                                                    setSuggestOpen(false);
                                                }}
                                                className="px-6 py-4 hover:bg-primary/5 cursor-pointer flex items-center gap-4 border-b border-gray-50 last:border-none transition-colors">
                                                <div className="flex flex-col">
                                                    <span className="text-on-surface font-bold text-sm">{placeName}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}

                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                            <MicIcon className="w-6 text-on-surface/40" />
                        </div>
                    </div>
                    <button type='button' onClick={() => setNotiOpen(true)} className="relative p-4 w-fit h rounded-full bg-white ring-2 ring-[#e09c99]/20 shadow-sm active:scale-95 transition-all">
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

                    <div className="space-y-8">
                        {filteredActivities.map((activity) => (
                            <NavLink to={`/activity-details?actid=${activity.id}`} key={activity.id} className="block" >
                                <div className="bg-white rounded-[35px] overflow-hidden shadow-[0_12px_32px_rgba(78,33,32,0.04)] hover:shadow-[0_12px_48px_rgba(78,33,32,0.08)] transition-all duration-300">

                                    <div className="relative h-50 w-full overflow-hidden">
                                        <img
                                            src={activity?.coverPhoto}
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

                                        <Wishlist activityId={activity.id} />

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
                    </div>
                </section>


            </main>
            <NotificationModal isOpen={notiOpen} onClose={() => setNotiOpen(false)} />
        </div>
    )
}

export default Activities