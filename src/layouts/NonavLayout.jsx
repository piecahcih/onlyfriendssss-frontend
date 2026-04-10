import React from "react";
import { Outlet } from "react-router";

function NonavLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default NonavLayout;
