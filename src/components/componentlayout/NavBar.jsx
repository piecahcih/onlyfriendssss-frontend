import { ChatIcon, CreateIcon, DiscoveryIcon, SearchIcon } from "../../icons"
import { NavLink } from "react-router"
import ProfilePic from "../profile/ProfilePic"
import useUserStore from "../../stores/userStore"

function NavBar() {
    const user = useUserStore(st=>st.user)
    console.log(user)

    const BACKEND_URL = "http://localhost:3999";

     const getFullImgPath = (path) => {
 if (!path) return "/default-avatar.png"; // ใส่รูป Default ถ้าไม่มีข้อมูล
    
       // ถ้าเป็น File Object (กรณีเพิ่งเลือกรูป) หรือ Base64 ให้คืนค่าเดิม
     if (typeof path !== 'string' || path.startsWith('data:')) {
       return path;
     }
  
     // ถ้าเป็น URL เต็มอยู่แล้ว (เช่นจาก Google Login)
      if (path.startsWith('http')) {
        return path;
      }

  // 3. ถ้าเป็น path จาก backend
  return `${BACKEND_URL}${path}`;
};
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
            <ProfilePic imgSrc={getFullImgPath(user?.profileImg)} className="rounded-full h-[30px] border border-white border-2"/>
            <p className="text-[bai-jamjuree-semibold] text-[12px]">Profile</p>
        </NavLink>
    </div>
  )
}

export default NavBar