import { NavLink, useNavigate } from 'react-router'
import { AppleLogo, FacebookLogo, GoogleLogo } from '../../icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../validators/schema'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../utils/firebase'
import mainApi from '../../api/mainApi'

function Login() {
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      const resp = await mainApi.post('/auth/login', {
        email: data.email,
        password: data.password
      })

      if (resp.status === 200) {
        localStorage.setItem('token', resp.data.token)
        console.log(resp.data)
        alert('เข้าสู่ระบบสำเร็จ')
        navigate('/identify-verification')
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
      console.error("Login Error:", error)
      alert(errMsg)
    }
  }

  googleProvider.setCustomParameters({
    prompt: 'select_account'
  })

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      console.log(idToken)
      const resp = await mainApi.post('/auth/registerOrLogin', {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      })

      if (resp.status === 200 || resp.status === 201) {
        localStorage.setItem('token', resp.data.token)
        console.log('Google Sync Response', resp.data)
        alert('เข้าสู่ระบบสำเร็จ')
        navigate('/identify-verification')
      }
    } catch (error) {
      console.error('Google Login Error', error)
      alert("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google")
    }
  }

  const { register, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit'
  })
  const { errors, isSubmitting, isValid } = formState

  const inpStyle = 'bg-base-100 rounded-[18px] px-5 py-2 w-[315px]'

  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="flex flex-col items-center pt-14">
        <h1 className='text-primary text-[32px] bai-jamjuree-bold my-8'>onlyfriendssss</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Email</h3>
                <input
                  type="text"
                  placeholder="Email"
                  {...register('email')}
                  className={inpStyle} />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Password</h3>
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className={inpStyle} />
              </div>

            </div>
            <div className="flex">
              <input
                type="checkbox"
                className="ml-4 mr-2 accent-primary"
                {...register('rememberMe')} />
              <p>Remember Me</p>
            </div>

            <button className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8">Login</button>
          </fieldset>

        </form>

        <div className="divider w-90 m-auto text-[12px] p-7">OR</div>

        <div className="flex justify-center gap-4 h-[50px]">
          <FacebookLogo className="bg-base-100 rounded-full p-2 text-black" />
          <button onClick={handleGoogleLogin} className="transition-transform active:scale-95 bg-base-100 rounded-full p-2 shadow-sm hover:bg-gray-100">
            <GoogleLogo className="w-8 h-6" />
          </button>
          <AppleLogo className="bg-base-100 rounded-full p-2" />
        </div>

        <p className="text-[12px] text-center mt-5">Don't have an account? <span className="underline"><NavLink to="/">Sign up</NavLink></span></p>
      </div>
    </div>
  )
}

export default Login