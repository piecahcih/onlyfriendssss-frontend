import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SearchIcon } from "../../icons";
import defaultProfile from "../../assets/default-profilepic.jpg";
import useFriendStore from "../../stores/friendStore";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function Friendlist() {
  const navigate = useNavigate();

  const hdlGoBack = () => {
    navigate(-1);
  };
  const [activeTab, setActiveTab] = useState("friends");
  const [searchTerm, setSearchTerm] = useState("");

  const { friends, requests, getFriends, acceptFriend, unFriendship } =
    useFriendStore();

  useEffect(() => {
    getFriends();
  }, []);

  const handleAccept = async (id) => {
    const result = await Swal.fire({
      title: "Accept Friend Request?",
      text: "Do you want to add this user as a friend?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#e09c99",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Accept!",
      borderRadius: "25px"
    });

    if (result.isConfirmed) {
      try {
        await acceptFriend(id);
        await getFriends(); 
        toast.success("Accepted friend request!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to accept");
      }
    }
  };

  const handleDelete = async (id, name, isRequest = false) => {
    const result = await Swal.fire({
      title: isRequest ? "Decline Request?" : "Unfriend?",
      text: `Are you sure you want to proceed with ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, proceed",
      borderRadius: "25px"
    });

    if (result.isConfirmed) {
      try {
        await unFriendship(id);
        await getFriends();
        toast.success(isRequest ? "Request declined" : `Unfriended ${name}`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to process");
      }
    }
  };

  // กรองตามแท็บที่เลือกและคำค้นหา
  const filteredData = activeTab === "friends" 
    ? friends.filter((item) => item.username?.toLowerCase().includes(searchTerm.toLowerCase()))
    : requests.filter((item) => item.sender?.username?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-base-200 pb-24 font-sans">
      {/* Header & Search */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => hdlGoBack()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <h1 className="text-secondary text-2xl font-black tracking-tight">
            Your friendssss
          </h1>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-base-content/30" />
          </div>
          <input
            type="text"
            placeholder={activeTab === "friends" ? "Search friends..." : "Search requests..."}
            className="w-full bg-base-200 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs Control */}
        <div className="flex mt-6 bg-base-200 p-1.5 rounded-2xl">
          <button
            onClick={() => {
                setActiveTab("friends");
                setSearchTerm("");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "friends"
                ? "bg-white shadow-md text-primary"
                : "text-base-content/40 hover:text-base-content/60"
              }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => {
                setActiveTab("requests");
                setSearchTerm("");
            }}
            className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === "requests"
                ? "bg-white shadow-md text-primary"
                : "text-base-content/40 hover:text-base-content/60"
              }`}
          >
            Requests ({requests.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 mt-6">
        {activeTab === "friends" ? (
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.friendshipId}
                  className="bg-white p-4 rounded-[25px] shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="avatar online">
                      <div className="w-14 rounded-full border-2 border-primary/5 group-hover:border-primary/20 transition-colors">
                        <img
                          src={item.profileImg || defaultProfile}
                          alt="user"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-neutral text-[15px]">{item.username}</h3>
                      <p className="text-[10px] font-black text-success uppercase tracking-widest">Online</p>
                    </div>
                  </div>

                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle btn-sm text-base-content/20 hover:text-primary"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content z-[20] menu p-2 shadow-2xl bg-white rounded-2xl w-44 border border-primary/5"
                    >
                      <li>
                        <a className="text-sm font-bold" onClick={() => navigate(`/user/${item.id}`)}>View Profile</a>
                      </li>
                      <li>
                        <a className="text-sm font-bold" onClick={() => navigate('/chat')}>Start Chat</a>
                      </li>
                      <div className="divider my-0 opacity-50"></div>
                      <li>
                        <a
                          onClick={() =>
                            handleDelete(item.friendshipId, item.username)
                          }
                          className="text-sm font-bold text-error"
                        >
                          Unfriend
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-base-content/30 italic font-medium">
                No friends found
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-[25px] shadow-sm flex items-center justify-between border border-primary/5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.sender?.profileImg || defaultProfile}
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary/5 shadow-sm"
                      alt="user"
                    />
                    <div>
                      <h3 className="font-bold text-neutral">
                        {item.sender?.username}
                      </h3>
                      <p className="text-[10px] font-bold text-base-content/40 uppercase tracking-tighter">
                        Wants to be your friend
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="btn btn-primary btn-sm rounded-xl px-5 text-white font-bold shadow-lg shadow-primary/20"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(item.id, item.sender?.username, true)
                      }
                      className="btn btn-ghost btn-sm rounded-xl text-base-content/30 hover:text-error hover:bg-error/5 font-bold"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-base-content/30 italic font-medium">
                No pending requests
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friendlist;
