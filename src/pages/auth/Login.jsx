import { NavLink, useNavigate } from "react-router";
import { AppleLogo, EyeIcon, EyeSlashIcon, FacebookLogo, GoogleLogo, WelcomeIcon, } from "../../icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validators/schema";
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { auth, googleProvider } from "../../utils/firebase";
import useUserStore from "../../stores/userStore";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

function Login() {
  const login = useUserStore((state) => state.login)
  const loginWithGoogle = useUserStore((state) => state.loginWithGoogle)
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
  })

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail)
      setValue("rememberMe", true)
    }

    // รับผลลัพธ์หลังจาก redirect กลับมาบนมือถือ
    getRedirectResult(auth)
      .then(async (result) => {
        if (!result) return;
        const idToken = await result.user.getIdToken();
        const userData = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };
        await loginWithGoogle(idToken, userData);
        navigate('/welcome');
      })
      .catch((error) => {
        if (error.code !== 'auth/no-auth-event') {
          console.error("Redirect Result Error", error);
          toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
        }
      });
  }, [setValue])

  const onSubmit = async (data) => {
    try {
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }
      const res = await login(data)
      toast.success(res.data.message)
      navigate('/welcome')
    } catch (error) {
      const errMsg = error.response?.data?.message
      toast.error(errMsg)
    }
  };

  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });

      if (isMobile()) {
        // มือถือ: ใช้ redirect แทน popup เพราะ popup ถูก browser block
        await signInWithRedirect(auth, googleProvider);
        return;
      }

      // คอม: ใช้ popup ตามปกติ
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const userData = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };
      await loginWithGoogle(idToken, userData);
      setTimeout(() => navigate('/welcome'), 1500);
    } catch (error) {
      console.error("Google Login Error", error);
      toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบด้วย Google");
    }
  };

  const inpStyle = "bg-base-100 rounded-[18px] px-5 py-2 w-[315px]"

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
                <h3 className="bai-jamjuree-semibold">Email</h3>
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email")}
                  className={inpStyle}
                />
                <p className="text-sm text-error">{errors.email?.message}</p>

              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="bai-jamjuree-semibold">Password</h3>

                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    {...register("password")}
                    className={`${inpStyle} pr-12 w-full`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"                  >
                    {showPassword ? (
                      <EyeIcon className="w-5 h-5" />
                    ) : (
                      <EyeSlashIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-error">{errors.password?.message}</p>
              </div>
            </div>
            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                className="ml-4 mr-2 accent-primary cursor-pointer w-4 h-4"
                {...register("rememberMe")}
              />
              <p className="text-sm">Remember Me</p>
            </div>

            <button className="bg-primary text-white bai-jamjuree-bold rounded-[18px] px-5 py-2 w-[315px] mt-8">
              Login
            </button>
          </fieldset>
        </form>

        <div className="divider w-90 m-auto text-[12px] p-7">OR</div>

        {/* <div className="flex justify-center gap-4 h-[50px]">
          <FacebookLogo className="bg-base-100 rounded-full p-2" />
          <button
            onClick={handleGoogleLogin}
            className="transition-transform active:scale-95 bg-base-100 rounded-full p-2 shadow-sm hover:bg-gray-100"
          >
            <GoogleLogo className="w-8 h-6" />
          </button>
          <AppleLogo className="bg-base-100 rounded-full p-2" />
        </div> */}

        <div className="flex justify-center gap-4 h-[40px] w-[315px]">
          <button onClick={handleGoogleLogin} className="w-full flex gap-3 items-center justify-center transition-transform active:scale-95 bg-base-100 rounded-full p-2 shadow-sm hover:bg-gray-100">
            <GoogleLogo className="w-8 h-5" /> Continue with Google
          </button>
        </div>

        <p className="text-[12px] text-center mt-5">
          Don't have an account?{" "}
          <span className="underline">
            <NavLink to="/">Sign up</NavLink>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
