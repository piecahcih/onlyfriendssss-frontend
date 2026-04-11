import { createBrowserRouter } from "react-router";
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
import ChooseLocation from "../pages/create/ChooseLocation";
import ShowCreate from "../pages/create/ShowCreate";
import InsideChat from "../pages/chat/InsideChat";
import Welcome from "../pages/Welcome";
import Friendlist from "../pages/Friends/Friendlist";
import NonavLayout from "../layouts/NonavLayout";

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
]);

const userRouter = createBrowserRouter([
  {
    path: "/",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <LDDiscover />,
      },
      {
        path: "welcome",
        element: <Welcome />,
      },
      {
        path: "activities",
        element: <Activities />,
      },
      {
        path: "create",
        element: <CreateActivity />,
      },
      {
        path: "create-chooselocation",
        element: <ChooseLocation />,
      },
      {
        path: "create-showcreate",
        element: <ShowCreate />,
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
        path: "chat/:name",
        element: <InsideChat />,
      },
      {
        path: "friendlist",
        element: <Friendlist />,
      },
    ],
  },
  {
    path: "*",
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <LDDiscover />,
      },
    ],
  },
]);

export { guestRouter, userRouter };
