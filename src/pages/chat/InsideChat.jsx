import React from "react";
import ProfilePic from "../../components/profile/ProfilePic";

function InsideChat() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* --- Header: Profile ด้านบน --- */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-white border-b p-3 shadow-sm">
        <div className="w-10 h-10">
          <ProfilePic className="rounded-full w-full h-full object-cover border" />
        </div>
        <div>
          <p className=" text-sm">Mr.Blue</p>
        </div>
      </div>

      {/* --- Chat Body --- */}
      <div className="flex-1 p-4 space-y-4">
        {/* ข้อความฝั่งเพื่อน  */}
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 shrink-0">
            <ProfilePic className="rounded-full w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border">
              <p>Hello! วันนี้อากาศดีนะ</p>
            </div>
            <span className="text-[9px] ml-1">11:52</span>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 shrink-0">
            <ProfilePic className="rounded-full w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border">
              <p>ไปกินตี๋น้อยกันไหม</p>
            </div>
            <span className="text-[9px] ml-1">11:52</span>
          </div>
        </div>

        {/* ข้อความฝั่งเรา */}
        <div className="flex items-end justify-end gap-2">
          <div className="flex flex-col gap-1 items-end max-w-[70%]">
            <div className=" bg-white p-3 rounded-2xl rounded-br-none border ">
              <p>ไปคับอ้วม</p>
            </div>
            <span className="text-[9px] ml-1">11:53</span>
          </div>
          <div className="w-8 h-8 shrink-0">
            <ProfilePic className="rounded-full w-full h-full " />
          </div>
        </div>

        {/* ข้อความฝั่งเพื่อน */}
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 shrink-0">
            <ProfilePic className="rounded-full w-full h-full " />
          </div>
          <div className="flex flex-col gap-1 max-w-[70%]">
            <div className="bg-white p-3 rounded-2xl rounded-bl-none border">
              <p>จัดไปครับคนดี</p>
            </div>
            <span className="text-[9px] ml-1">11:54</span>
          </div>
        </div>
      </div>

      {/* --- Input--- */}
      <div className="sticky bottom-0 bg-white p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Typing..."
          className="flex-1 bg-base-100 rounded-full px-4 py-2"
        />
        <button className="bg-secondary text-white px-4 py-2 rounded-full text-sm ß shadow-sm hover:bg-amber-600">
          send
        </button>
      </div>
    </div>
  );
}

export default InsideChat;
