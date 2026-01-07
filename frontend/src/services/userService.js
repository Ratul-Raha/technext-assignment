import api from "../api/axios"

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