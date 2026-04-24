import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SearchIcon } from "../../icons";
import ProfilePic from "../../components/profile/ProfilePic";
import useChatStore from "../../stores/chatStore";

function Chat() {
  const navigate = useNavigate();
  const { rooms, unreadCounts, setActiveRoom, getChatRooms } = useChatStore();
  // const getChatRooms = useChatStore(state => state.getChatRooms)
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");


  useEffect(() => {
    getChatRooms()
  }, [getChatRooms]);

  const hdlGoBack = () => {
    navigate(-1);
  };

  // กรองตามการค้นหาและแท็บ พร้อมทั้งเรียงลำดับตามเวลาล่าสุด
  const filteredRooms = (rooms || [])
    .filter((room) => {
      const matchesSearch = (room.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || room.type === activeTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      const timeA = new Date(a.lastMessage?.createdAt || 0).getTime();
      const timeB = new Date(b.lastMessage?.createdAt || 0).getTime();
      return timeB - timeA; // เรียงจากใหม่ไปเก่า
    });

  const handleRoomClick = (room) => {
    const title = room.name || "Chat";
    setActiveRoom(room.id);
    
    // หา friendId สำหรับแชทส่วนตัว
    const friendId = room.type === "PRIVATE" ? (room.targetUserId || room.friendId || room.friend?.id) : null;

    navigate(`/chat/${encodeURIComponent(title)}`, {
      state: {
        roomId: room.id,
        title: title,
        icon: room.image,
        friendId: friendId // ส่ง id เพื่อนไปด้วย
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-200 pb-24 font-sans">
      {/* Header & Search (Friendlist Style) */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={hdlGoBack}
            className="btn btn-ghost btn-circle btn-sm text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-secondary text-2xl font-bold bai-jamjuree-bold">
            Chat Roomssss
          </h1>
        </div>

        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full bg-base-300 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs Control (Friendlist Style) */}
        <div className="flex mt-6 bg-base-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "all"
              ? "bg-white shadow-sm text-primary font-bold"
              : "text-base-content/50"
              }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("ACTIVITY")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "ACTIVITY"
              ? "bg-white shadow-sm text-primary font-bold"
              : "text-base-content/50"
              }`}
          >
            Activities
          </button>
          <button
            onClick={() => setActiveTab("PRIVATE")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "PRIVATE"
              ? "bg-white shadow-sm text-primary font-bold"
              : "text-base-content/50"
              }`}
          >
            Friends
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 mt-4 space-y-3">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((item) => (
            <div
              key={item.id}
              onClick={() => handleRoomClick(item)}
              className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <div className="avatar">
                    <div className="w-14 rounded-full border border-primary/10 overflow-hidden">
                      <img
                        src={item.image || "https://api.dicebear.com/8.x/avataaars/svg?seed=" + item.id}
                        alt="chat-icon"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  {unreadCounts[item.id] > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {unreadCounts[item.id]}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <h3 className="font-bold text-[15px] text-neutral truncate pr-2">{item.name}</h3>
                    <span className="text-[10px] opacity-40 whitespace-nowrap">
                      {item.lastMessage?.createdAt ? new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.type === "ACTIVITY" && (
                      <span className="text-[9px] font-black text-primary/50 uppercase tracking-tighter bg-primary/5 px-1 rounded-sm">Group</span>
                    )}
                    <p className="text-xs text-base-content/60 truncate italic pr-4">
                      {item.lastMessage?.content || "Start a conversation..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ml-2 text-base-content/20 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-base-content/40 italic flex flex-col items-center gap-2">
            <div className="opacity-20"><SearchIcon className="w-12 h-12" /></div>
            <p className="bai-jamjuree-medium">No chats found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;