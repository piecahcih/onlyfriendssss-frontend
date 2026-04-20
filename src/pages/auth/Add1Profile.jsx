import { useLocation, useNavigate } from "react-router"
import defaultProfile from "../../assets/default-profilepic.jpg"
import ProfilePic from "../../components/profile/ProfilePic"
import { PhotoIcon } from "../../icons"
import { useState } from "react"
import { updateProfileApi } from "../../api/mainApi"
import { toast } from "react-toastify"
import useUserStore from "../../stores/userStore"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addProfile } from '../../validators/schema'


function Add1Profile() {
  const registeringUser = useUserStore(state => state.registeringUser)
  const setRegisteringUser = useUserStore(state => state.setRegisteringUser)
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(addProfile),
    mode: "onSubmit",
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      gender: 'OTHER',
      bio: ''
    }
  })

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  const hdlFileChange = (e) => {
    const selectFile = e.target.files[0]
    if (selectFile) {
      if (preview) URL.revokeObjectURL(preview)
      const newPreviewUrl = URL.createObjectURL(selectFile)
      setFile(selectFile)
    setPreview(newPreviewUrl)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (!registeringUser?.id) {
        return toast.error("Account not found. Please register");
      }

      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('firstName', data.firstName)
      formData.append('lastName', data.lastName)
      formData.append('gender', data.gender)
      formData.append('bio', data.bio)

      if (file) formData.append('profileImg', file)

      const res = await updateProfileApi(registeringUser.id, formData)
      setRegisteringUser(res.data.user || registeringUser)
      toast.success('Update Success')
      setTimeout(() => {
        navigate('/add-interest');
      }, 1500)
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || 'Please fill in all required fields')
    }
  }

  const genderOptions = ['MALE', 'FEMALE', 'OTHER']
  const selectedGender = watch('gender')
  const inpStyle = 'border border-neutral/50 rounded-[18px] px-5 py-2 w-[315px]'
  return (
    <div className='bg-base-200 min-h-screen'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
        <div
          onClick={() => document.getElementById('fileInput').click()}
          className="relative h-[150px] w-[150px] my-3 mx-auto cursor-pointer active:scale-95 transition-transform"
        >
          <ProfilePic
            imgSrc={preview || (registeringUser?.profileImg ? `http://localhost:3999/uploads/${registeringUser.profileImg}` : defaultProfile)}
            className="rounded-full h-[150px] w-[150px] border-4 border-primary object-cover"
          />

          {!(preview || registeringUser?.profileImg) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full border-4 border-transparent">
              <PhotoIcon className="text-white w-8 h-8 mb-1" />
              <span className="text-white text-xs font-medium uppercase tracking-wider">
                Add Profile
              </span>
            </div>
          )}
          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={hdlFileChange}
            accept="image/*"
          />
        </div>

        <div className="flex flex-col items-start gap-3">
          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>Username</h3>
            <input
              {...register('username')}
              className={inpStyle}
            />
            {errors.username && <p className="text-sm text-error">{errors.username.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>First Name</h3>
            <input
              {...register('firstName')}
              className={inpStyle}
            />
            {errors.firstName && <p className="text-sm text-error">{errors.firstName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className='bai-jamjuree-semibold'>Last Name</h3>
            <input
              {...register('lastName')}
              className={inpStyle}
            />
            {errors.lastName && <p className="text-sm text-error">{errors.lastName.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <h3 className='bai-jamjuree-semibold'>Gender</h3>
            <div className="flex gap-3 w-full">
              {genderOptions.map((item) => (
                <label
                  key={item}
                  className={`flex-1 flex items-center justify-between py-1.5 px-4 rounded-xl border transition-all duration-200 active:scale-95 ${selectedGender === item
                    ? 'border-primary bg-primary/10 text-primary shadow-sm font-semibold'
                    : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <span className="text-sm capitalize bai-jamjuree-semibold">{item.toLowerCase()}</span>
                  <input
                    type="radio"
                    value={item}
                    {...register('gender')}
                    className="hidden"
                  />
                </label>
              ))}
            </div>
            {errors.gender && <p className="text-sm text-error">{errors.gender.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <h3 className='bai-jamjuree-semibold'>Tell us about yourself</h3>
            <textarea
              {...register('bio')}
              className="border border-neutral/50 w-full p-3 rounded-[12px]"
              placeholder="What's your interest?"
            />
            {errors.bio && <p className="text-sm text-error">{errors.bio.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-5 hover:opacity-90"
        >
          Complete
        </button>
      </form>
    </div>
  )
}

export default Add1Profile