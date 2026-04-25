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
  const user = useUserStore(st => st.user);
  const token = useUserStore(st => st.token);
  const finalRouter = !user ? guestRouter : userRouter;

  const { connectSocket } = useSocketStore();
  useEffect(() => {
    if (token) {
      connectSocket(token);
    }
  }, [token]);


  useChatEvents();
  useNotification();

  // Session check
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
      <Toast />
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
