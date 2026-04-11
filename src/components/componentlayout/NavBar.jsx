import { ChatIcon, CreateIcon, DiscoveryIcon, SearchIcon } from "../../icons"
import defaultProfile from "../../assets/default-profilepic.jpg"
import useUserStore from "../../stores/userStore"

function NavBar() {
    const logout = useUserStore(state => state.logout)
    return (
        <div className='h-[78px] bg-primary flex justify-between pt-4 px-5'>
            <div className="flex flex-col items-center text-white w-[50px]">
                <DiscoveryIcon className="w-7" />
                <p className="text-[bai-jamjuree-semibold] text-[12px]">Discover</p>
            </div>
            <div className="flex flex-col items-center text-white w-[50px]">
                <SearchIcon className="w-7" />
                <p className="text-[bai-jamjuree-semibold] text-[12px]">Activities</p>
            </div>
            <div className="flex flex-col items-center text-white w-[50px]">
                <CreateIcon className="w-11" />
            </div>
            <div className="flex flex-col items-center text-white w-[50px]">
                <ChatIcon className="w-7" />
                <p className="text-[bai-jamjuree-semibold] text-[12px]">Discover</p>
            </div>
            <div className="flex flex-col items-center text-white w-[50px] object-cover">
                <button onClick={logout}>
                    <img src={defaultProfile} alt="profilepic" className="rounded-full h-[30px] border border-white border-2" />
                    <p className="text-[bai-jamjuree-semibold] text-[12px]">Profile</p>
                </button>
            </div>
        </div>
    )
}

export default NavBar