import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import useSocketStore from "./stores/socketStore";
import { useChatEvents } from "./hooks/useChatEvents";

function App() {
  const user = useUserStore(st => st.user);
  const finalRouter = !user ? guestRouter : userRouter;

  const [isRedirecting, setIsRedirecting] = useState(false);

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
    const token = localStorage.getItem('token');
    if (token) {
      connectSocket(token);
    }
  }, [user]);

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
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
