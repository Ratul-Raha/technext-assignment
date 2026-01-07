import api from "../api/axios"

export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData)
  return res.data
}

export const loginUser = async (credentials) => {
  const res = await api.post("/auth/login", credentials)
  return res.data
}

export const getProfile = async (token) => {
  const res = await api.get("/user/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const updateProfile = async (token, profileData) => {
  const res = await api.put("/user/profile", profileData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const changePassword = async (token, passwordData) => {
  const res = await api.put("/user/change-password", passwordData, {
    headers: { Authorization: `Bearer ${token}` },
  })
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