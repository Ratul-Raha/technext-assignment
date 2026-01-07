import api from "../api/axios"

// CREATE a new shortened URL
export const createShortUrl = async (urlData, token) => {
  const res = await api.post("/url", urlData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// GET all URLs for the current user
export const getUrls = async (token) => {
  const res = await api.get("/url", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// DELETE a URL by ID
export const deleteUrl = async (id, token) => {
  const res = await api.delete(`/url/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

// OPTIONAL: Get single URL stats
export const getUrlStats = async (id, token) => {
  const res = await api.get(`/url/${id}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
