import React from 'react'

function CreateActivity() {
  return (
    <div className="min-h-screen bg-base-200 text-[#4e2120] font-sans">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-[#fff4f3] shadow-[0_8px_32px_rgba(78,33,32,0.08)] flex items-center px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="text-[#a83100] hover:opacity-80 transition-opacity active:scale-95 transition-transform duration-200">
            <span className="text-2xl">←</span>
          </button>
          <h1 className="tracking-[-0.02em] font-bold text-[1.75rem]">Create Activity</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 pt-8 space-y-8">
        {/* Hero Section/Image Upload */}
        <section className="relative group">
          <div className="w-full h-56 rounded-2xl overflow-hidden bg-[#ffdad8] relative">
            <img
              alt="Activity Cover"
              className="w-full h-full object-cover opacity-80"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqEw2q8gkMcCj8DSotqZOrmkwjuoABmpXLuohb4kPP-H_xCBRdsdznmt7NuxMN4b8Oo-FmIMq3qKF50ObGJzg52nhtI8cum2X0JKmYyC_bt9KxOfHUedBBVx8x5rizD6gsuX7OwmIf-E7uO0XcXpCBiYSEwn-EpLzWVVF-bcpLGwG19xFeCaUr2nPeGBLykw2WLgDvE1EIJGtPhT2ihGK5l7OjE5U4r7K6u2h8WJFUbw2YG2bHmYX4nSNISTSclbfUAuHGTPg-JP12"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#4e2120]/10 backdrop-blur-sm transition-all group-hover:backdrop-blur-none">
              <div className="bg-white/90 p-4 rounded-full shadow-lg cursor-pointer active:scale-90 transition-transform">
                <span className="text-3xl">📷</span>
              </div>
              <span className="mt-3 text-sm font-semibold">Add Cover Photo</span>
            </div>
          </div>
        </section>

        {/* Form Fields */}
        <form className="space-y-6">
          {/* Activity Name */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#834c4b] flex items-center gap-2">
              Activity Name
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">✏️</span>
              <input
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] focus:ring-2 transition-all outline-none text-[#4e2120] placeholder:text-[#834c4b]/40"
                placeholder="Morning Hiking in the Hills"
                type="text"
              />
            </div>
          </div>

          {/* Public Badge / Privacy */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-[#ffedeb]">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌎</span>
              <div>
                <p className="font-bold text-[#4e2120]">Public Activity</p>
                <p className="text-xs text-[#834c4b]">Visible to everyone in the community</p>
              </div>
            </div>
            <div className="w-12 h-6 bg-[#a83100] rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#834c4b]">Location</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📍</span>
              <input
                className="w-full pl-14 pr-6 py-4 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-[#4e2120]"
                placeholder="Central Park, New York"
                type="text"
              />
            </div>
            <div className="w-full h-32 mt-3 rounded-2xl overflow-hidden grayscale brightness-95 opacity-80">
              <img
                alt="Map snippet"
                className="w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPfhKMwa-5XOrbeWnnmM-FuuFAveQ5O3WXcVxLMxv5vcalHwzoZn_r-34v7SiXlcFHX3klvs6wHllC0UGhnywo4FFzs1M33QYgP1u437uJ5tDE8SUNjUKqAw1GCkhYCDpegc5vSZZhsPy4Oyqtgd6UYdBxzDP-xIBSNOXrNAN0690VS9Kw9tV7r0X-FUmF_1W-tFI93IwqypVMuxIuPQafXspSvqftgaaZ2ZwtJ8r30tm90v7Vlbz7WzHXqiPKNKeyGfs5-jH9TUQe"
              />
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#834c4b]">Date</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">📅</span>
                <input
                  className="w-full pl-14 pr-4 py-4 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-[#4e2120] text-sm"
                  placeholder="Oct 24, 2023"
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#834c4b]">Time</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🕒</span>
                <input
                  className="w-full pl-14 pr-4 py-4 rounded-full bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-[#4e2120] text-sm"
                  placeholder="08:30 AM"
                  type="text"
                />
              </div>
            </div>
          </div>

          {/* Category Chips */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#834c4b] flex items-center gap-2">
              <span>🏷️</span> Category
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                className="px-5 py-2 rounded-2xl bg-[#ff784c] text-white text-sm font-medium flex items-center gap-2 transition-all"
                type="button"
              >
                <span>💪</span> Health
              </button>
              <button
                className="px-5 py-2 rounded-2xl bg-[#ffdad8] text-[#834c4b] text-sm font-medium flex items-center gap-2 hover:bg-[#ffd2d0] transition-all"
                type="button"
              >
                <span>🎭</span> Entertainment
              </button>
              <button
                className="px-5 py-2 rounded-2xl bg-[#ffdad8] text-[#834c4b] text-sm font-medium flex items-center gap-2 hover:bg-[#ffd2d0] transition-all"
                type="button"
              >
                <span>🎨</span> Art
              </button>
              <button
                className="px-5 py-2 rounded-2xl bg-[#ffdad8] text-[#834c4b] text-sm font-medium flex items-center gap-2 hover:bg-[#ffd2d0] transition-all"
                type="button"
              >
                <span>🍱</span> Food
              </button>
              <button
                className="px-5 py-2 rounded-2xl bg-[#ffdad8] text-[#834c4b] text-sm font-medium flex items-center gap-2 hover:bg-[#ffd2d0] transition-all"
                type="button"
              >
                <span>✈️</span> Travel
              </button>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#834c4b]">Notes</label>
            <div className="relative">
              <span className="absolute left-5 top-6 text-xl">📝</span>
              <textarea
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-white border-none ring-2 ring-[#e09c99]/20 focus:ring-[#a83100] transition-all outline-none text-[#4e2120] placeholder:text-[#834c4b]/40 resize-none"
                placeholder="Tell us more about the activity, what to bring, and expectations..."
                rows="4"
              ></textarea>
            </div>
          </div>
        </form>

        {/* Main CTA */}
        <div className="pt-4 pb-12">
          <button className="w-full py-5 rounded-full bg-gradient-to-r from-[#a83100] to-[#ff784c] text-white font-bold text-lg shadow-[0_8px_32px_rgba(168,49,0,0.24)] active:scale-95 transition-all">
            Create Activity
          </button>
        </div>
      </main>
    </div>
  )
}

export default CreateActivity
