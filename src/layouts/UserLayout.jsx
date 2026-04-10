import React from "react";
import NavBar from "../components/componentlayout/NavBar";
import { Outlet } from "react-router";

function UserLayout() {
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
