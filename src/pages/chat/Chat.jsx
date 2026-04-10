import React from "react";
import { useNavigate } from "react-router";
import { DiscoveryIcon, Notification, SearchIcon } from "../../icons";
import ProfilePic from "../../components/profile/ProfilePic";

function Chat() {
  const navigate = useNavigate();

  return (
    <div className="bg-base-100 min-h-screen p-6 pt-10">
      <div className="flex items-center gap-3 w-full max-w-md mx-auto">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-4 pr-10 py-2 border rounded-4xl"
          />

          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div>
          <Notification className=" w-7 h-7" />
        </div>
      </div>

      {/* User Profile */}
      <div className="flex items-center justify-center gap-4 p-3 ">
        <div className="w-16 h-16">
          <ProfilePic className="rounded-full w-full h-full object-cover" />
        </div>
        <div className="w-16 h-16">
          <ProfilePic className="rounded-full w-full h-full object-cover" />
        </div>
        <div className="w-16 h-16">
          <ProfilePic className="rounded-full w-full h-full object-cover" />
        </div>
        <div className="w-16 h-16">
          <ProfilePic className="rounded-full w-full h-full object-cover" />
        </div>
      </div>

      {/* Chat & Requset */}
      <div>
        <div className="flex justify-between">
          <p>Chat</p>
          <p>Request</p>
        </div>
      </div>

      {/* Chat chanel */}

      <div className="  pt-2 flex items-center gap-2.5 .bai-jamjuree-semibold">
        <div>
          <ProfilePic className=" w-16 h-16 rounded-full" />
        </div>
        <div>
          <p>We like to party</p>
        </div>
      </div>
      <div className="pt-2 flex items-center gap-2.5 .bai-jamjuree-semibold">
        <div>
          <ProfilePic className=" w-16 h-16 rounded-full" />
        </div>
        <div>
          <p>We like to excercise</p>
        </div>
      </div>
      <div className=" pt-2 flex items-center gap-2.5 .bai-jamjuree-semibold">
        <div>
          <ProfilePic className=" w-16 h-16 rounded-full" />
        </div>
        <div>
          <p>We like to gaming</p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
