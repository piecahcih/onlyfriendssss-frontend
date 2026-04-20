import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";

function GuestLayout() {
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
    </div>
  );
}

export default GuestLayout;
