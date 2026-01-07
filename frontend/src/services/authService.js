import api from "../api/axios"

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData)
  return res.data
}

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials)
  return res.data
}


export const logoutUser = async (token) => {
  const res = await api.post(
    "/auth/logout",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return res.data
}