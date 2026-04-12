import { useLocation, useNavigate } from "react-router"
import defaultProfile from "../../assets/default-profilepic.jpg"
import ProfilePic from "../../components/profile/ProfilePic"
import { PhotoIcon } from "../../icons"
import useUserStore from "../../stores/userStore"
import { useState } from "react"
import { updateProfileApi } from "../../api/mainApi"
import { toast } from "react-toastify"

function Add1Profile() {
  const navigate = useNavigate()
  const location = useLocation()

  const newUser = location.state?.newUser

  const [input, setInput] = useState({
    username: '',
    firstName: '',
    lastName: '',
    gender: '',
    bio: '',
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const hdlInputChange = (e) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const hdlFileChange = (e) => {
    const selectFile = e.target.files[0]
    if (selectFile) {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
      const newPreviewUrl = URL.createObjectURL(selectFile);

      setFile(selectFile)
      setPreview(newPreviewUrl)
      console.log("Preview URL created:", newPreviewUrl)
    }
  }

  const hdlSubmit = async () => {
    try {
      if (!newUser?.id) {
        return toast.error("ไม่พบข้อมูลผู้ใช้ กรุณาสมัครสมาชิกใหม่อีกครั้ง");
      }

      const formData = new FormData()
      formData.append('username', input.username)
      formData.append('firstName', input.firstName)
      formData.append('lastName', input.lastName)
      formData.append('gender', input.gender)
      formData.append('bio', input.bio)
      if (file) formData.append('profileImg', file)

      const res = await updateProfileApi(newUser.id, formData)
      toast.success('Update Success')
      navigate('/add-interest', { state: { newUser } })
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.message || "เกิดข้อผิดพลาด")
    }
  }

  const gender = ['MALE', 'FEMALE', 'OTHERS']

  const inpStyle = 'border border-neutral/50 rounded-[18px] px-5 py-2 w-[315px]'
  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="flex flex-col items-center">
        <div className="relative group cursor-pointer h-[150px] w-[150px] my-3">
          <ProfilePic
            src={preview || (newUser?.profileImg ? `http://localhost:3999/uploads/${newUser.profileImg}` : defaultProfile)}
            className="rounded-full h-[150px] w-[150px] border-4 border-primary object-cover"
          />
          <div onClick={() => document.getElementById('fileInput').click()}
            className="absolute inset-0 flex flex-col items-center justify-center opacity-0 border-4 border-white rounded-full group-hover:opacity-80 bg-base-content transition-opacity duration-300">
            <PhotoIcon className="text-white w-10 h-10" />
          </div>
          <input type="file" id="fileInput" className="hidden" onChange={hdlFileChange} accept="image/*" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>Username</h3>
            <input type="text" name="username" value={input.username} onChange={hdlInputChange} className={inpStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>FirstName</h3>
            <input type="text" name="firstName" value={input.firstName} onChange={hdlInputChange} className={inpStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>Lastname</h3>
            <input type="text" name="lastName" value={input.lastName} onChange={hdlInputChange} className={inpStyle} />
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>Gender</h3>
            <div className="flex gap-3 w-full">
              {gender.map((item) => (
                <label
                  key={item}
                  className={`flex-1 flex cursor-pointer items-center justify-between py-1.5 px-4 rounded-xl border-1 transition-all duration-200 active:scale-95${input.gender === item
                    ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                    : 'border-gray-100  text-gray-500 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                >
                    <span className="text-sm capitalize bai-jamjuree-semibold">{item}</span>
                  <input
                    type="radio"
                    name="gender"
                    value={item}
                    checked={input.gender === item}
                    onChange={hdlInputChange}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <h3 className='bai-jamjuree-semibold'>Tell us about your self</h3>
            <textarea name="bio" value={input.bio} onChange={hdlInputChange} className="border border-neutral/50 w-full p-3 rounded-[12px]" placeholder="What's your interest?"></textarea>
          </div>
        </div>

        <button onClick={hdlSubmit} className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-5 hover:opacity-90">
          Complete
        </button>
      </div>
    </div>
  )
}

export default Add1Profile