import axios from "axios"
import useUserStore from "../stores/userStore"

export const mainApi = axios.create({
  baseURL: "http://localhost:3999/api",
  // baseURL: `${BASE_URL}/api`,
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

// ดึงข้อมูลเพื่อน (public profile)
export const getFriendProfileApi = (userId) => mainApi.get(`/account/profile/${userId}`);

// แก้ไขข้อมูลตัวเอง (username, bio, gender, etc.)
export const editProfileApi = (formData) => mainApi.patch("/account/profile", formData,);

export const deleteProfileApi = (id) => mainApi.delete("/account/profile", id)


////////JOIN ACTIVITY (เพิ่มใหม่ตรงนี้)
export const joinActivityApi = (activityId) => mainApi.post("/join", { activityId });
export const manageJoinRequestApi = (requestId, status) => mainApi.patch("/join/manage-request", {
  requestId, status
});
export const leaveActivityApi = (activityId) => mainApi.delete(`/join/leave/${activityId}`);



////////INTEREST
export const getUserInterestApi = () => mainApi.get("/interest")
export const getUserSuggestedActivitiesByInterestApi = () => mainApi.get("/interest/suggested")
export const exploreActivitiesApi = () => mainApi.get("/interest/suggested-all")



////////ACTIVITIES
export const getAllCurrentActivitiesApi = () => mainApi.get("/activity")
export const getUpcomingActivitiesApi = () => mainApi.get("/activity/upcoming-activities")
export const getAllActivitiesApi = () => mainApi.get("/activity/all")
export const getAllFinishedActivitiesOnThisAccountApi = () => mainApi.get("/activity/my-memories")
export const getAllActivitiesCreatedByThisAccountApi = () => mainApi.get("/activity/my-created-activities")
export const getAllActivitiesJoinedByThisAccountApi = () => mainApi.get("/activity/my-joined-activities")
export const getActivityByIdApi = (activityid) => mainApi.get(`/activity/${activityid}`)
export const getActivityByCategoryApi = (category) => mainApi.get(`/activity/category/${category}`)
export const createActivityApi = (body) => mainApi.post("/activity", body)
export const editActivityByIdApi = (activityid, body) => mainApi.patch(`/activity/${activityid}`, body)
export const changeActivityStatusApi = (activityid, body) => mainApi.patch(`/activity/status/${activityid}`, body)
export const cancelActivityStatusApi = (activityid) => mainApi.patch(`/activity/cancel/${activityid}`)
export const deleteActivityByIdApi = (activityid) => mainApi.delete(`/activity/${activityid}`)


///// Wishlist
export const getAllWishlist = () => mainApi.get('/wishlist')
export const addWishlist = (activityId) => mainApi.post('/wishlist', { activityId })
export const deleteWishlist = (activityId) => mainApi.delete(`/wishlist/${activityId}`)

////Chat
export const getChatRoomsApi = () => mainApi.get("/chat/rooms");
export const getChatHistoryApi = (roomId) => mainApi.get(`/chat/messages/${roomId}`);
export const getOrCreatePrivateRoomApi = (friendId) => mainApi.post("/chat/rooms/private", { friendId });
export const markChatAsReadApi = (roomId) => mainApi.patch(`/chat/rooms/${roomId}/read`);







////////REVIEWS
export const getActivityRatingsApi = () => mainApi.get('/review/activity-scores')
export const getUserRatingsApi = () => mainApi.get('/review/user-scores')
export const getPlaceRatingsApi = () => mainApi.get('/review/place-scores')

export const getUserApi = (userid) => mainApi.get(`/review/user/${userid}`)

export const getAllUsersReviewsApi = () => mainApi.get('/review/users')
export const getAllReviewsMeApi = () => mainApi.get('/review/who-reviews-me')

export const getAllActivitiesReviewsApi = () => mainApi.get('/review/activities')
export const getActivityReviewsApi = (actid) => mainApi.get(`/review/activity/${actid}`)
export const getActivityReviewsByLocationApi = (placeid) => mainApi.get(`/review/place/${placeid}`)
export const getSpecificReviewApi = (reviewid) => mainApi.get(`/${reviewid}`)

export const createReviewActivityApi = (actid, body) => mainApi.post(`/review/activity/${actid}`, body)
export const createReviewUserApi = (actid, receiverid, body) => mainApi.post(`/review/user/${actid}/${receiverid}`, body)


////////NOTIFICATIONS
export const getNotificationsApi = () => mainApi.get('/noti')
export const markAsReadApi = (id) => mainApi.patch(`/noti/${id}/read`)
export const markAllAsReadApi = () => mainApi.patch('/noti/read-all')


export default mainApi;
