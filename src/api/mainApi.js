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

export default mainApi;
