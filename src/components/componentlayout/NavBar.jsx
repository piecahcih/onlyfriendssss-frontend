import { ChatIcon, CreateIcon, DiscoveryIcon, SearchIcon } from "../../icons"
import { NavLink } from "react-router"
import ProfilePic from "../profile/ProfilePic"
import useUserStore from "../../stores/userStore"

function NavBar() {
    const user = useUserStore(st=>st.user)
    
  return (
    <div className='h-[78px] bg-primary flex justify-between pt-4 px-5'>
        <NavLink to ='/lddiscover' className="flex flex-col items-center text-white w-[50px]">
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
            <ProfilePic imgSrc={user?.profileImg} className="rounded-full h-[30px] border border-white border-2"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Profile</p>
        </NavLink>
    </div>
  )
}

export default NavBar