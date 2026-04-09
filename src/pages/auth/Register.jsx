import { NavLink } from 'react-router'
import { AppleLogo, FacebookLogo, GoogleLogo } from '../../icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../validators/schema'

function Register() {
  const {register, handleSubmit, formState} = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
        email:'', password: '', confirmPassword: '', firstName: '', lastName: ''
    }
  })
  const {errors, isSubmitting, isValid} = formState

  const inpStyle = 'bg-base-100 rounded-[18px] px-5 py-2 w-[315px]'
  return (
    <div className='bg-base-200 min-h-screen'>
      <div className="flex flex-col items-center pt-14">
        <h1 className='text-primary text-[32px] bai-jamjuree-bold my-8'>onlyfriendssss</h1>
        <form action="">
          <fieldset>
            <div className="flex flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Email</h3>
                <input type="text" placeholder="Email" {...register('email')} 
                  className={inpStyle}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Password</h3>
                <input type="password" placeholder="Password" {...register('password')} 
                  className={inpStyle}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Confirm Password</h3>
                <input type="password" placeholder="Confirm Password" {...register('confirmPassword')} 
                  className={inpStyle}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Firstname</h3>
                <input type="text" placeholder="Firstname" {...register('firstName')} 
                  className={inpStyle}/>
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className='bai-jamjuree-semibold'>Lastname</h3>
                <input type="text" placeholder="Lastname" {...register('lastName')} 
                  className={inpStyle}/>
              </div>

            </div>

            <button className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8">Register</button>
          </fieldset>

        </form>

    <div className="divider mx-12 text-[12px]">OR</div>

        <div className="flex justify-center gap-4 h-[50px]">
          <FacebookLogo className="bg-base-100 rounded-full p-2 text-black"/>
          <GoogleLogo className="bg-base-100 rounded-full p-2"/>
          <AppleLogo className="bg-base-100 rounded-full p-2"/>
        </div>
        
        <p className="text-[12px] text-center mt-5">Already have account? <span className="underline"><NavLink to="/login">Login</NavLink></span></p>
      </div>
    </div>
  )
}

export default Register