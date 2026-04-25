import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import ProfilePic from "../../components/profile/ProfilePic";
import { LeftIcon } from "../../icons";
import useChatStore from "../../stores/chatStore";
import useSocketStore from "../../stores/socketStore";
import useUserStore from "../../stores/userStore";
import defaultProfile from "../../assets/default-profilepic.jpg";

function InsideChat() {
  const { state } = useLocation();
  const navigate = useNavigate();


  const token = useUserStore((state) => state.token);
  const user = useUserStore((state) => state.user);
  const { socket, connectSocket, isConnected } = useSocketStore();
  const { messages, setActiveRoom, getChatHistory } = useChatStore();


  const roomId = state?.roomId;
  const chatTitle = state?.title || state?.name || "Chat Room";
  const chatIcon = state?.icon || state?.image;

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  useEffect(() => {

    console.log('tokenmaima', token)

    if (token && !isConnected) {
      connectSocket(token);
    }


    if (roomId && socket && isConnected) {
      setActiveRoom(roomId);
      getChatHistory(roomId);

      socket.emit("join_room", { roomId });
      console.log(`✅ Joined room: ${roomId}`);

      return () => {
        socket.emit("leave_room", { roomId });
      };
    }
  }, [roomId, socket, isConnected, token, connectSocket, setActiveRoom, getChatHistory]);

  // 4. ฟังก์ชันส่งข้อความ
  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedText = inputText.trim();

    if (!trimmedText || !socket || !roomId || !isConnected) return;

    const messageData = {
      roomId,
      content: trimmedText,
    };

    socket.emit("send_message", messageData, (res) => {
      if (res?.success) {
        setInputText("");
      } else {
        console.error("❌ Send failed:", res?.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fbf9f6] flex flex-col font-sans">

      {/* --- HEADER --- */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm sticky top-0 z-20 flex items-center gap-3 border-b border-primary/5">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-circle btn-sm text-secondary"
        >
          <LeftIcon className="w-8 h-8 fill-current" />
        </button>

        <div className="avatar shrink-0">
          <div className="w-10 h-10 rounded-full border border-primary/10 overflow-hidden bg-gray-100 shadow-inner">
            <img
              src={chatIcon || defaultProfile}
              alt="chat-icon"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-neutral font-black truncate leading-tight text-sm">
            {chatTitle}
          </h2>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isConnected ? "bg-success" : "bg-error"} shadow-sm`}></span>
            <p className="text-[10px] text-base-content/40 font-bold uppercase tracking-widest">
              {isConnected ? "Online" : "Connecting..."}
            </p>
          </div>
        </div>
      </div>

      {/* --- MESSAGE LIST --- */}
      <div className="flex-1 p-5 space-y-6 overflow-y-auto pb-32">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => {
            const senderId = msg.sender?.id || msg.senderId;
            const isMe = String(senderId) === String(user?.id);

            return (
              <div
                key={msg.id || idx}
                className={`flex items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* รูปโปรไฟล์คนอื่น */}
                {!isMe && (
                  <div
                    className="w-9 h-9 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white mb-5"
                    onClick={() => navigate(`/friend-profile?userId=${senderId}`)}
                  >
                    <ProfilePic
                      className="w-full h-full object-cover pointer-events-none"
                      imgSrc={msg.sender?.profileImg || defaultProfile}
                    />
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>

                  {/* แสดงชื่อ USER สำหรับคนอื่น */}
                  {!isMe && (
                    <span className="text-[10px] font-black text-secondary/60 ml-1 uppercase tracking-wider">
                      {msg.sender?.username || "Friend"}
                    </span>
                  )}

                  {/* กล่องข้อความ */}
                  <div
                    className={`p-3.5 shadow-md ${isMe
                      ? "bg-linear-to-r from-primary to-secondary text-white rounded-2xl rounded-br-none font-bold"
                      : "bg-white text-neutral rounded-2xl rounded-bl-none border border-base-200 font-medium"
                      }`}
                  >
                    <p className="text-[14px] leading-relaxed break-words">
                      {msg.content}
                    </p>
                  </div>

                  {/* เวลาส่ง */}
                  <span className="text-[9px] opacity-40 px-2 font-black uppercase tracking-tighter">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      : "NOW"}
                  </span>
                </div>

                {/* รูปโปรไฟล์เราเอง */}
                {isMe && (
                  <div
                    className="w-9 h-9 shrink-0 rounded-full overflow-hidden border-2 border-white shadow-sm bg-white mb-5"
                  >
                    <ProfilePic
                      className="w-full h-full object-cover"
                      imgSrc={user?.profileImg || defaultProfile}
                    />
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-20 text-center opacity-20 italic text-sm">
            No messages yet. Say hi! 👋
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-md p-4 border-t border-primary/5 z-20">
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 items-center max-w-2xl mx-auto"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-[#f1f1f1] border-none rounded-2xl py-3.5 px-6 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || !isConnected}
            className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all shadow-lg active:scale-90 ${inputText.trim() && isConnected
              ? "bg-linear-to-r from-primary to-secondary text-white shadow-primary/30"
              : "bg-gray-100 text-gray-300"
              }`}
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

export default InsideChat;