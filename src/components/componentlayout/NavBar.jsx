import { ChatIcon, CreateIcon, DiscoveryIcon, SearchIcon } from "../../icons"
import defaultProfile from "../../assets/default-profilepic.jpg"

function NavBar() {
  return (
    <div className='h-[78px] bg-primary flex justify-between pt-4 px-5'>
        <div className="flex flex-col items-center text-white w-[50px]">
            <DiscoveryIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Discover</p>
        </div>
        <div className="flex flex-col items-center text-white w-[50px]">
            <SearchIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Activities</p>
        </div>
        <div className="flex flex-col items-center text-white w-[50px]">
            <CreateIcon className="w-11"/>
        </div>
        <div className="flex flex-col items-center text-white w-[50px]">
            <ChatIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Chat</p>
        </div>
        <div className="flex flex-col items-center text-white w-[50px] object-cover">
            <img src={defaultProfile} alt="profilepic" className="rounded-full h-[30px] border border-white border-2" />
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Profile</p>
        </div>
    </div>
  )
}

export default NavBar