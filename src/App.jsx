import { RouterProvider } from "react-router";
import { guestRouter, userRouter } from "./router/router";
import useUserStore from "./stores/userStore";
import { useEffect } from "react";

function App() {
  // const user = null
  const user = { email: 'peach@gmail.com'}
  const finalRouter = user ? userRouter : guestRouter ;

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
      <RouterProvider router={finalRouter} />
    </>
  );
}

export default App;
