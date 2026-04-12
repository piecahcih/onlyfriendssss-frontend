import React from 'react';
import NavBar from '../../components/componentlayout/NavBar';
import ProfilePic from '../../components/profile/ProfilePic';

// Local icons to avoid modifying src/icons/index.jsx
const LocationIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ProfileIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Account = () => {
  return (
    <div className="bg-base-200 min-h-screen flex flex-col font-sans pb-24">
   

      {/* Profile Header Section */}
      <div className="bg-white px-6 pt-12 pb-6 rounded-b-[50px] shadow-sm mb-6 relative">
        {/* Notification Bell Icon */}
        <div className="absolute top-8 right-6">
          <button className="p-2 rounded-full border border-orange-200 text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-xl bai-jamjuree-bold text-neutral mb-6">Profile</h2>
          
          <div className="flex items-center w-full gap-4 mb-6">
            {/* Profile Image */}
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
             <ProfilePic />
            </div>

            {/* Stats Card */}
            <div className="flex-1">
               <h3 className="text-lg bai-jamjuree-bold text-neutral text-center mb-2">Mr. Catlover</h3>
               <div className="bg-secondary rounded-[35px] py-4 px-2 flex justify-around text-white shadow-lg">
                  <div className="text-center">
                    <div className="text-lg bai-jamjuree-bold">4.9</div>
                    <div className="text-[10px] opacity-80 bai-jamjuree-medium">Rating</div>
                  </div>
                  <div className="w-[1px] bg-white/30 self-stretch"></div>
                  <div className="text-center">
                    <div className="text-lg bai-jamjuree-bold">10</div>
                    <div className="text-[10px] opacity-80 bai-jamjuree-medium">Events</div>
                  </div>
                  <div className="w-[1px] bg-white/30 self-stretch"></div>
                  <div className="text-center">
                    <div className="text-lg bai-jamjuree-bold">122</div>
                    <div className="text-[10px] opacity-80 bai-jamjuree-medium">Friends</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-secondary text-white py-3 rounded-2xl bai-jamjuree-bold shadow-md hover:bg-orange-600 transition-all">
            Request to be Friend +
          </button>
        </div>
      </div>



        {/* Bio Section */}
        <div className="w-full text-left space-y-2 mb-6">
          <p className="text-sm bai-jamjuree-medium text-neutral">Tell me your favorite colors, I wanna know you</p>
          <p className="text-sm bai-jamjuree-medium text-neutral">Male</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {['Talkative', 'Good manners', 'Foodie', 'Super User'].map((tag) => (
              <span key={tag} className="bg-secondary text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>
     

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button className="flex-1 py-3 text-lg bai-jamjuree-bold text-primary border-b-2 border-primary">Joined</button>
        <button className="flex-1 py-3 text-lg bai-jamjuree-bold text-neutral opacity-60">Created</button>
        <button className="flex-1 py-3 text-lg bai-jamjuree-bold text-neutral opacity-60">Memory</button>
      </div>

      {/* Activity Card */}
      <div className="px-4">
        <div className="bg-white rounded-[45px] overflow-hidden shadow-sm mb-6 border border-gray-100">
          <div className="relative h-64">
            <img 
              src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Yoga" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#8b5cf6]/90 text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-semibold">Featured Host</span>
              <span className="bg-secondary/90 text-white px-4 py-1.5 rounded-full text-xs bai-jamjuree-semibold">3 spots left</span>
            </div>
          </div>
          
          <div className="p-6">
            <h3 className="text-xl bai-jamjuree-bold text-neutral-focus mb-4">Golden Hour Sunset Yoga</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-neutral/70">
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span className="text-sm bai-jamjuree-medium">Tomorrow, 06:30 PM</span>
              </div>
              <div className="flex items-center gap-3 text-neutral/70">
                <LocationIcon className="w-5 h-5 text-primary" />
                <span className="text-sm bai-jamjuree-medium">Pier 14, Waterfront Park</span>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary flex items-center justify-center text-white text-xs bai-jamjuree-bold">
                  +12
                </div>
              </div>
              <span className="text-secondary bai-jamjuree-medium text-sm">Going</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-primary rounded-t-[40px] flex justify-around items-center px-4 shadow-lg z-50">
        <NavBar />
      </div>
    </div>
  );
};

export default Account;
