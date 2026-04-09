import { createBrowserRouter } from "react-router";
import GuestLayout from "../layouts/GuestLayout";
import Register from "../pages/auth/Register";
import IdenVeri from "../pages/auth/IdenVeri";
import UserLayout from "../layouts/UserLayout";
import LDDiscover from "../pages/LDDiscover";
import Activities from "../pages/Activities";
import CreateAct from "../pages/CreateAct";
import Chat from "../pages/Chat";
import Profile from "../pages/Profile";
import Login from "../pages/auth/Login";

const guestRouter = createBrowserRouter([
    {
        path:"/",
        element:<GuestLayout/>,
        children:[
            {
                index: true,
                element: <Register/>
            },
            {
                path: 'login',
                element:<Login/>
            },
            {
                path: 'identify-verification',
                element:<IdenVeri/>
            }
        ]
    }
])

const userRouter = createBrowserRouter([
    {
        path:"/",
        element:<UserLayout/>,
        children:[
            {
                index: true,
                element: <LDDiscover/>
            },
            {
                path: 'activities',
                element: <Activities/>
            },
            {
                path:'create',
                element: <CreateAct/>
            },
            {
                path:'chat',
                element: <Chat/>
            },
            {
                path:'profile',
                element: <Profile/>
            }
        ]
    }
])

export{ guestRouter, userRouter }