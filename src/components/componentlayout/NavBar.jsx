import { ChatIcon, CreateIcon, DiscoveryIcon, HomeIcon, SearchIcon } from "../../icons"
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

  const NavStyle = ({ isActive }) =>`flex flex-col items-center w-[50px] ${isActive ? "text-primary" :"text-secondary-content"}`

  return (
    <div className='h-[78px] bg-base-200/80 backdrop-blur-md flex justify-between pt-4 px-5'>
        <NavLink to ='/'  className={NavStyle}>
            <HomeIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[10px]">Home</p>
        </NavLink>
        <NavLink to ='/discover'   className={NavStyle}>
            {/* <DiscoveryIcon className="w-7"/> */}
            <SearchIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[10px]">Activities</p>
        </NavLink>
        <NavLink to ='/create'   className={NavStyle}>
            <CreateIcon className="w-11 text-primary"/>
        </NavLink>
        <NavLink to ='/chat'   className={NavStyle}>
            <ChatIcon className="w-7"/>
            <p className="text-[bai-jamjuree-semibold] text-[10px]">Chat</p>
        </NavLink>
        <NavLink to ='/profile' className={NavStyle}>
          {({ isActive }) => (
            <>
              <ProfilePic 
                imgSrc={getFullImgPath(user?.profileImg)} 
                className={`rounded-full h-[30px] border-2 transition-colors ${
                  isActive ? "border-primary" : "border-secondary-content"
                }`}
              />
              <p className="text-[bai-jamjuree-semibold] text-[10px]">Profile</p>
            </>
          )}
        </NavLink>
    </div>
  )
}

export default NavBar