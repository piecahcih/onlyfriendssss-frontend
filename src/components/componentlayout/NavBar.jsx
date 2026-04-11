import { ChatIcon, CreateIcon, DiscoveryIcon, SearchIcon } from "../../icons"
import defaultProfile from "../../assets/default-profilepic.jpg"
import { NavLink } from "react-router"

function NavBar() {
  return (
    <div className='h-[78px] bg-primary flex justify-between pt-4 px-5'>
        <NavLink to ='/' className="flex flex-col items-center text-white w-[50px]">
            <DiscoveryIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Discover</p>
        </NavLink>
        <NavLink to ='/activities' className="flex flex-col items-center text-white w-[50px]">
            <SearchIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Activities</p>
        </NavLink>
        <NavLink to ='/create' className="flex flex-col items-center text-white w-[50px]">
            <CreateIcon className="w-11"/>
        </NavLink>
        <NavLink to ='/chat' className="flex flex-col items-center text-white w-[50px]">
            <ChatIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Chat</p>
        </NavLink>
        <NavLink to ='/profile' className="flex flex-col items-center text-white w-[50px] object-cover">
            <img src={defaultProfile} alt="profilepic" className="rounded-full h-[30px] border border-white border-2" />
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Profile</p>
        </NavLink>
    </div>
  )
}

export default NavBar