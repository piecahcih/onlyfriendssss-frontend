import axios from "axios"
import useUserStore from "../stores/userStore"

export const mainApi = axios.create({
  baseURL: "http://localhost:3999/api"
})

mainApi.interceptors.request.use((config) => {
  const token = useUserStore.getState().token
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
});

export const registerApi = (body) => mainApi.post("/auth/register", body)
export const loginApi = (body) => mainApi.post("/auth/login", body)
export const googleLoginApi = (idToken) =>
  mainApi.post(
      "/auth/registerOrLogin",
      {},
      {
        headers: { Authorization: `Bearer ${idToken}` },
      },
  );
export const updateProfileApi = (id, formData) => mainApi.patch(`/auth/register/profile/${id}`, formData)
export const addInterests = (id, formData) => mainApi.post(`/auth/register/interests/${id}`, formData)


////////FRIEND
// friendRoute.get("/list", ...)
export const GetFriendListApi = async () => await mainApi.get("/friend/list");

// friendRoute.post("/request/:id", ...)
export const SendFriendRequestApi = async (targetId) =>
  await mainApi.post(`/friend/request/${targetId}`);

// friendRoute.patch("/accept/:id", ...)
export const AcceptFriendApi = async (friendshipId) =>
  await mainApi.patch(`/friend/accept/${friendshipId}`);

// friendRoute.delete("/unfriend/:id", ...)
export const UnfriendApi = async (friendshipId) =>
  await mainApi.delete(`/friend/unfriend/${friendshipId}`);



////////USER PROFILE
// ดึงข้อมูลตัวเอง
export const getProfileApi = () => mainApi.get("/account/profile");

// แก้ไขข้อมูลตัวเอง (username, bio, gender, etc.)
export const updateProfileApi = (body) => mainApi.patch("/account/profile", body);


export default mainApi;
