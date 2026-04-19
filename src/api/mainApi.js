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
export const editProfileApi = (formData) => mainApi.patch("/account/profile", formData,);

export const deleteProfileApi = (id) => mainApi.delete("/account/profile", id)



////////ACTIVITIES
export const getAllCurrentActivitiesApi = () => mainApi.get("/activity")
export const getAllActivitiesApi = () => mainApi.get("/activity/all")
export const getAllFinishedActivitiesOnThisAccountApi = () => mainApi.get("/activity/my-memories")
export const getAllActivitiesCreatedByThisAccountApi = () => mainApi.get("/activity/my-created-activities")
export const getAllActivitiesJoinedByThisAccountApi = () => mainApi.get("/activity/my-joined-activities")
export const getActivityByIdApi = (activityid) => mainApi.get(`/activity/${activityid}`)
export const getActivityByCategoryApi = (category) => mainApi.get(`/activity/category/${category}`)
export const createActivityApi = (body) => mainApi.post("/activity", body)
export const editActivityByIdApi = (activityid) => mainApi.patch(`/activity/${activityid}`)
export const changeActivityStatusApi = (activityid, body) => mainApi.patch(`/activity/status/${activityid}`, body)
export const deleteActivityByIdApi = (activityid) => mainApi.delete(`/activity/${activityid}`)


///// Wishlist
export const getAllWishlist = () => mainApi.get('/wishlist')
export const addWishlist = (activityId) => mainApi.post('/wishlist', { activityId })
export const deleteWishlist = (activityId) => mainApi.delete(`/wishlist/${activityId}`)



export default mainApi
