import React, { useState, useEffect } from "react";
import { SearchIcon } from "../../icons";
import defaultProfile from "../../assets/default-profilepic.jpg";
import useFriendStore from "../../stores/friendStore";
import { toast } from "react-toastify";

function Friendlist() {
  const [activeTab, setActiveTab] = useState("friends");
  const [searchTerm, setSearchTerm] = useState("");

  const { friends, requests, getFriends, acceptFriend, unFriendship } =
    useFriendStore();

  useEffect(() => {
    getFriends();
  }, []);

  const handleAccept = async (id) => {
    try {
      await acceptFriend(id);
      await getFriends();
      toast.success("Accepted friend request!");
    } catch (error) {
      toast.error("Failed to accept");
    }
  };

  const handleDelete = async (id, name) => {
    console.log("id", name);
    if (window.confirm(`Are you sure you want to proceed with ${name}?`)) {
      try {
        await unFriendship(id);
        await getFriends();
        toast.success(`Remove ${name} from the list`);
      } catch (error) {
        toast.error("Failed to remove");
      }
    }
  };

  const filteredFriends = friends.filter((item) =>
    item.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-base-200 pb-24">
      {/* Header & Search */}
      <div className="bg-white px-5 pt-8 pb-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-secondary text-2xl font-bold bai-jamjuree-bold">
          Your friendssss
        </h1>

        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-base-content/50" />
          </div>
          <input
            type="text"
            placeholder="Search friends..."
            className="w-full bg-base-300 border-none rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabs Control */}
        <div className="flex mt-6 bg-base-200 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "friends"
                ? "bg-white shadow-sm text-primary"
                : "text-base-content/50"
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "requests"
                ? "bg-white shadow-sm text-primary"
                : "text-base-content/50"
            }`}
          >
            Requests ({requests.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-5 mt-4">
        {activeTab === "friends" ? (
          /* --- My Friends --- */
          <div className="space-y-3">
            <p className="text-xs font-bold text-base-content/40 uppercase pl-2">
              All Friends
            </p>

            {filteredFriends.length > 0 ? (
              filteredFriends.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-transparent hover:border-primary/10 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <div className="avatar online">
                      <div className="w-12 rounded-full border border-primary/10">
                        <img
                          src={item.profileImg || defaultProfile}
                          alt="user"
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{item.username}</h3>
                      <p className="text-xs text-success">Online</p>
                    </div>
                  </div>

                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-circle btn-sm text-base-content/30"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5"
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
                      className="dropdown-content z-[20] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-200"
                    >
                      <li>
                        <a className="text-sm">View Profile</a>
                      </li>
                      <li>
                        <a className="text-sm">Start Chat</a>
                      </li>
                      <div className="divider my-0"></div>
                      <li>
                        <a
                          onClick={() =>
                            handleDelete(item.friendshipId, item.username)
                          }
                          className="text-sm text-error"
                        >
                          Unfriend
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-base-content/50 italic">
                No friends found
              </div>
            )}
          </div>
        ) : (
          /* --- Friend Requests --- */
          <div className="space-y-3">
            <p className="text-xs font-bold text-base-content/40 uppercase pl-2">
              Pending Invitations
            </p>
            {requests.length > 0 ? (
              requests.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-primary/5"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.sender?.profileImg || defaultProfile}
                      className="w-12 h-12 rounded-full object-cover border border-primary/10"
                      alt="user"
                    />
                    <div>
                      <h3 className="font-semibold text-sm">
                        {item.sender?.username}
                      </h3>
                      <p className="text-xs text-base-content/60">
                        Wants to be your friend
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="btn btn-primary btn-sm rounded-lg px-4 shadow-sm"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(item.id, item.sender?.username)
                      }
                      className="btn btn-ghost btn-sm rounded-lg text-base-content/40 hover:text-error hover:bg-error/10"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center text-base-content/50 italic">
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
