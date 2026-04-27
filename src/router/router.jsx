import { createBrowserRouter, Navigate } from "react-router";
import GuestLayout from "../layouts/GuestLayout";
import Register from "../pages/auth/Register";
import IdenVeri from "../pages/auth/IdenVeri";
import UserLayout from "../layouts/UserLayout";
import LDDiscover from "../pages/LDDiscover";
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
import LocationReview from "../pages/reviews/LocationReview";
import EditActivityDetails from "../pages/EditActivityDetails";
import ActivitiesReview from "../pages/reviews/ActivitiesReview";
import PeerReview from "../pages/reviews/PeerReview";
import MemoryActivityDetails from "../pages/reviews/MemoryActivityDetails";
import RatingReview from "../pages/reviews/RatingReview";
import HomePage from "../pages/HomePage";
import ActivitiesList from "../pages/ActivitiesList";
import FriendProfile from "../pages/Friends/FriendProfile";
import FriendReviews from "../pages/Friends/FriendReviews";
import FriendJoinedActivities from "../pages/Friends/FriendJoinedActivities";
import FriendCreatedActivities from "../pages/Friends/FriendCreatedActivities";
import UserJoinedActivities from "../pages/reviews/UserJoinedActivities";
import UserCreatedActivities from "../pages/UserCreatedActivities";
import UserMemoryActivities from "../pages/UserMemoryActivities";

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
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "discover",
        element: <LDDiscover />,
      },
      {
        path: "activities-list",
        element: <ActivitiesList />,
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
        path: "welcome",
        element: <Welcome />,
      },
      {
        path: "chat/:roomId",
        element: <InsideChat />,
      },
      {
        path: "friendlist",
        element: <Friendlist />,
      },
      {
        path: "friend-profile",
        element: <FriendProfile />,
      },
      {
        path: "friend-reviews",
        element: <FriendReviews />,
      },
      {
        path: "friend-joined-activities",
        element: <FriendJoinedActivities />,
      },
      {
        path: "friend-created-activities",
        element: <FriendCreatedActivities />,
      },
      {
        path: "joined-activities",
        element: <UserJoinedActivities />,
      },
      {
       path: "created-activities", 
       element: <UserCreatedActivities />,
     },
     {
        path: "memory-activities",
        element: <UserMemoryActivities />,
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
      {
        path: "edit-activity-details",
        element: <EditActivityDetails />,
      },
      {
        path: "memory-activity-details",
        element: <MemoryActivityDetails />,
      },
      {
        path: "reviews-peer",
        element: <PeerReview />,
      },
      {
        path: "reviews-rating",
        element: <RatingReview />,

      },

      {
        path: "reviews-activities",
        element: <ActivitiesReview />,
      },

      {
        path: "location-reviews",
        element: <LocationReview />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

export { guestRouter, userRouter };
