import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  // const user = { email: 'peach@gmail.com'}
  const user = useUserStore((st) => st.user);
  ////  ยังไม่ได้เพิ่ม routerAdim ให้พีชมาเพิ่มเอง
  const finalRouter = !user ? guestRouter : userRouter;

  useEffect(() => {
    const { user, rememberMe, logout } = useUserStore.getState();
    const isNewSession = !sessionStorage.getItem("session_active");

    if (user && !rememberMe && isNewSession) {
      logout();
    }
    sessionStorage.setItem("session_active", "true");
  }, []);

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
