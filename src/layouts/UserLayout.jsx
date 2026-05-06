import { useEffect } from "react";
import NavBar from "../components/componentlayout/NavBar";
import { Outlet, useLocation } from "react-router";

function UserLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return (
    <div>
      <Outlet />
      <div className="fixed bottom-0 left-0 right-0 z-100">
        <NavBar />
      </div>
    </div>
  );
}

export default UserLayout;
