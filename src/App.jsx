import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import useSocketStore from "./stores/socketStore";
import { useChatEvents } from "./hooks/useChatEvents";
import { useNotification } from "./hooks/useNotification";
import { Toast } from "./components/noti/Toast";


function App() {
  // const user = { email: 'peach@gmail.com'}
  const user = useUserStore(st => st.user)
  ////  ยังไม่ได้เพิ่ม routerAdim ให้พีชมาเพิ่มเอง
  const finalRouter = !user ? guestRouter : userRouter

  useChatEvents();
  useNotification();

  useEffect(() => {
    const { user, rememberMe, logout } = useUserStore.getState();
    const isNewSession = !sessionStorage.getItem("session_active");

    if (user && !rememberMe && isNewSession) {
      logout();
    }
    sessionStorage.setItem("session_active", "true");
  }, []);

  const { connectSocket } = useSocketStore();
  const token = useUserStore(st => st.token);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [user, token, connectSocket]);


  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <Toast />
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
