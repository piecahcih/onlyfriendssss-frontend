import { useState } from 'react';
import { MicIcon, Notification, SearchIcon } from '../icons'
import NotificationModal from '../components/NotificationModal';

function LDDiscover() {
    const [selectedCategory, setSelectedCategory] = useState("all");
    const categoryList = [
        { id: "all", title: "All", icon: "✨" },
        { id: "health", title: "Health & Wellness", icon: "💪" },
        { id: "entertainment", title: "Chill & Hangout", icon: "🎭" },
        { id: "art", title: "Creative", icon: "🎨" },
        { id: "food", title: "Foodies", icon: "🍱" },
        { id: "travel", title: "Travel", icon: "✈️" }
    ];

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
          <button onClick={()=>setNotiOpen(true)} className="relative p-4 w-fit h rounded-full bg-white ring-2 ring-[#e09c99]/20 shadow-sm active:scale-95 transition-all">
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

      </main>

      <NotificationModal isOpen={notiOpen} onClose={()=>setNotiOpen(false)} />
    </div>
  )
}

export default LDDiscover