import { createBrowserRouter, Navigate } from "react-router";
import GuestLayout from "../layouts/GuestLayout";
import Register from "../pages/auth/Register";
import IdenVeri from "../pages/auth/IdenVeri";
import UserLayout from "../layouts/UserLayout";
import LDDiscover from "../pages/LDDiscover";
import Activities from "../pages/Activities";
import Chat from "../pages/chat/Chat";
import Profile from "../pages/Profile";
import Login from "../pages/auth/Login";
import Add2Interest from "../pages/auth/Add2Interest";
import Add1Profile from "../pages/auth/Add1Profile";
import CreateActivity from "../pages/create/CreateActivity";
import ShowCreate from "../pages/create/ShowCreate";
import InsideChat from "../pages/chat/InsideChat";
import Welcome from "../pages/Welcome";
import Friendlist from "../pages/Friends/Friendlist";
import NonavLayout from "../layouts/NonavLayout";
import ActivityDetails from "../pages/ActivityDetails";
// import LDD2 from "../pages/LLD2";

const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "identify-verification",
        element: <IdenVeri />,
      },
      {
        path: "add-profile",
        element: <Add1Profile />,
      },
      {
        path: "add-interest",
        element: <Add2Interest />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      // {
      //   index: true,
      //   element: <LDD2 />,
      // },
      {
        path: "lddiscover",
        element: <LDDiscover />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "chat",
        element: <Chat />,
      },
    ],
  },
  {
    path: "/",
    element: <NonavLayout />,
    children: [
      {
        index: true,
        element: <Welcome />,
      },
      {
        path: "chat/:name",
        element: <InsideChat />,
      },
      {
        path: "friendlist",
        element: <Friendlist />,
      },
      {
        path: "create",
        element: <CreateActivity />,
      },
      {
        path: "create-showcreate",
        element: <ShowCreate />,
      },
      {
        path: "activity-details",
        element: <ActivityDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export { guestRouter, userRouter };
