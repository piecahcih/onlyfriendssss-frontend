import { NavLink, useNavigate } from 'react-router'
import { AppleLogo, EyeIcon, EyeSlashIcon, FacebookLogo, GoogleLogo } from '../../icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../validators/schema'
import { registerApi } from '../../api/mainApi'
import { signInWithPopup } from 'firebase/auth'
import { toast } from 'react-toastify'
import { googleProvider, auth } from '../../utils/firebase'
import useUserStore from '../../stores/userStore'
import { useState } from 'react'

function Register() {
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle)
  const setRegisteringUser = useUserStore((state) => state.setRegisteringUser)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const navigate = useNavigate()

  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    }
  })
  const { errors, isSubmitting, isValid } = formState

  const onSubmit = async (data) => {
    try {
      const resp = await registerApi(data)
      setRegisteringUser(resp.data.user)
      // console.log(resp.data.message)
      toast.success(resp.data.message)
      setTimeout(() => {
        navigate('/add-profile')
      }, 1500)
    } catch (error) {
      const errMsg = error.response?.data.message || error.message
      console.log(error.response?.data)
      toast.error(errMsg)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      // console.log(result.user)
      await loginWithGoogle(idToken)
      toast.success('Login Success')
      navigate('/welcome')
    } catch (error) {
      console.error('Google Login Error', error)
      toast.error("Google login failed. Please try again.")
    }
  }

  const inpStyle = "bg-base-100 rounded-[18px] px-5 py-2 w-[315px]";
  return (
    <div className="bg-base-200 min-h-screen">
      <div className="flex flex-col items-center pt-14">
        <h1 className="text-primary text-[32px] bai-jamjuree-bold my-8">
          onlyfriendssss
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Email</h3>
                <input type="email" placeholder="Email" {...register('email')}
                  className={inpStyle} />
                <p className="text-sm text-error">{errors.email?.message}</p>

              </div>
              <div className="relative flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Password</h3>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...register('password')}
                  className={`${inpStyle} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-[50px] -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (<EyeIcon className="w-5 h-5" />) : (<EyeSlashIcon className="w-5 h-5" />)}
                </button>
                <p className="text-sm text-error">{errors.password?.message}</p>
              </div>
              <div className="relative flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Confirm Password</h3>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register('confirmPassword')}
                  className={`${inpStyle} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-[50px] -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (<EyeIcon className="w-5 h-5" />) : (<EyeSlashIcon className="w-5 h-5" />)}
                </button>
                <p className="text-sm text-error">{errors.confirmPassword?.message}</p>
              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8 flex justify-center items-center ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : 'Register'}
            </button>
          </fieldset>
        </form>

        <div className="divider mx-12 text-[12px]">OR</div>

        <div className="flex justify-center gap-4 h-[50px]">
          <FacebookLogo className="bg-base-100 rounded-full p-2 text-black" />
          <button onClick={handleGoogleLogin} className="transition-transform active:scale-95 bg-base-100 rounded-full p-2 shadow-sm hover:bg-gray-100">
            <GoogleLogo className="w-8 h-6" />
          </button>
          <AppleLogo className="bg-base-100 rounded-full p-2" />
        </div>

        <p className="text-[12px] text-center mt-5">Already have account? <span className="underline"><NavLink to="/login">Login</NavLink></span></p>
      </div>
    </div>
  );
}

export default Register;
