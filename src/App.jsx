import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSocketStore from "./stores/socketStore";
import { useChatEvents } from "./hooks/useChatEvents";
import { useNotification } from "./hooks/useNotification";
import { Toast } from "./components/noti/Toast";

function App() {
  const user = useUserStore(st => st.user);
  const token = useUserStore(st => st.token);
  const finalRouter = !user ? guestRouter : userRouter;

  const theme = useUserStore(st => st.theme)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const [isRedirecting, setIsRedirecting] = useState(false);

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

  const { connectSocket } = useSocketStore();

  useEffect(() => {
    if (token) {
      console.log('App.jsx: Calling connectSocket with token:', token);
      connectSocket(token);
    } else {
      console.log('App.jsx: Token is not available, not calling connectSocket.');
    }
  }, [token]);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem("hasSeenWelcome");
    if (user && window.location.pathname === "/" && !hasSeenWelcome) {
      setIsRedirecting(true);
      window.location.replace("/welcome");
    }
  }, [user]);

  if (isRedirecting) return null;

  return (
    <>
      <ToastContainer theme="colored" position="top-right" />
      <Toast />
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
