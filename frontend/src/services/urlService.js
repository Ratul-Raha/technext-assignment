import api from "../api/axios"

export const createShortUrl = async (urlData, token) => {
  const res = await api.post("/url", urlData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const getUrls = async (token) => {
  const res = await api.get("/url", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const deleteUrl = async (id, token) => {
  const res = await api.delete(`/url/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export const getUrlStats = async (id, token) => {
  const res = await api.get(`/url/${id}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}
