import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useSocketStore from "./stores/socketStore";
import { useChatEvents } from "./hooks/useChatEvents";


function App() {
  // const user = { email: 'peach@gmail.com'}
  const user = useUserStore(st => st.user)
  ////  ยังไม่ได้เพิ่ม routerAdim ให้พีชมาเพิ่มเอง
  const finalRouter = !user ? guestRouter : userRouter

  useChatEvents();

  useEffect(() => {
    const { user, rememberMe, logout } = useUserStore.getState();
    const isNewSession = !sessionStorage.getItem("session_active");

    if (user && !rememberMe && isNewSession) {
      logout();
    }
    sessionStorage.setItem("session_active", "true");
  }, []);

  const { connectSocket } = useSocketStore();

  useEffect(() => {
    const token = localStorage.getItem('token'); // หรือดึงจาก store
    if (token) {
      connectSocket(token);
    }
  }, [user]);


  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
