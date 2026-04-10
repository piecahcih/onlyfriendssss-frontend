import React, { useState } from "react";
import { SearchIcon } from "../../icons";
import defaultProfile from "../../assets/default-profilepic.jpg";

const mockFriends = [
  {
    id: 1,
    username: "Peach",
    firstName: "Pichayapa",
    lastName: "Thaisedhawatkul",
    profileImg: "https://i.pinimg.com/736x/82/b5/59/82b5591589b5b545726a31fd54728fd4.jpg",
    status: "Online",
  },
  {
    id: 2,
    username: "Benjy",
    firstName: "Phattharaphon",
    lastName: "Saengphak",
    profileImg: "https://i.pinimg.com/736x/82/b5/59/82b5591589b5b545726a31fd54728fd4.jpg",
    status: "Away",
  },
  {
    id: 3,
    username: "Keng",
    firstName: "Harit",
    lastName: "Buayoi",
    profileImg: "https://res.cloudinary.com/piecahcih/image/upload/v1774238072/y9x0bjp2guf5q7ds8lmb.jpg",
    status: "Offline",
  },
  {
    id: 4,
    username: "Art",
    firstName: "Attachai",
    lastName: "Jumpahome",
    profileImg: "https://i.pinimg.com/736x/82/b5/59/82b5591589b5b545726a31fd54728fd4.jpg",
    status: "Online",
  },
  {
    id: 5,
    username: "Hera",
    firstName: "Jatuphon",
    lastName: "Seedas",
    profileImg: "https://res.cloudinary.com/piecahcih/image/upload/v1774238072/y9x0bjp2guf5q7ds8lmb.jpg",
    status: "In a meeting",
  },
];

function Friendlist() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFriends = mockFriends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200 pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold bai-jamjuree-bold text-neutral-focus">Friends</h1>
        
        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full bg-base-300 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Friends List */}
      <div className="px-5 mt-4 space-y-3">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <div
              key={friend.id}
              className="flex items-center justify-between p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-transparent hover:border-primary/20"
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img
                    src={friend.profileImg || defaultProfile}
                    alt={friend.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary/10"
                    onError={(e) => {
                      e.target.src = defaultProfile;
                    }}
                  />
                  <div 
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      friend.status === "Online" ? "bg-success" : 
                      friend.status === "Away" ? "bg-warning" : "bg-base-content/30"
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-semibold bai-jamjuree-semibold text-neutral-focus">
                    {friend.username}
                  </h3>
                  <p className="text-xs text-base-content/70 bai-jamjuree-regular">
                    {friend.firstName} {friend.lastName}
                  </p>
                  <p className="text-[10px] mt-0.5 text-primary font-medium">
                    {friend.status}
                  </p>
                </div>
              </div>
              
              <button className="btn btn-circle btn-ghost btn-sm text-base-content/40 hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-base-content/50 bai-jamjuree-medium italic">No friends found</p>
          </div>
        )}
      </div>

      {/* Quick Actions / Floating Button (Optional) */}
      <div className="fixed bottom-24 right-6">
        <button className="btn btn-primary btn-circle shadow-lg hover:scale-105 active:scale-95 transition-transform border-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Friendlist;
