import axios from "axios";
import useUserStore from "../stores/userStore";

export const friendApi = axios.create({
  baseURL: "http://localhost:3999/api",
  headers: {
    "Content-Type": "application/json",
  },
});

friendApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//friend api
// friendRoute.get("/list", ...)
export const GetFriendListApi = async () => await friendApi.get("/friend/list");

// friendRoute.post("/request/:id", ...)
export const SendFriendRequestApi = async (targetId) =>
  await friendApi.post(`/friend/request/${targetId}`);

// friendRoute.patch("/accept/:id", ...)
export const AcceptFriendApi = async (friendshipId) =>
  await friendApi.patch(`/friend/accept/${friendshipId}`);

// friendRoute.delete("/unfriend/:id", ...)
export const UnfriendApi = async (friendshipId) =>
  await friendApi.delete(`/friend/unfriend/${friendshipId}`);

export default friendApi;
