import axios from "axios"

const api = axios.create({
  // baseURL: "http://localhost:5000/api", // backend URL
  baseUrl: "https://easyurl-server.vercel.app/api", // production URL
  withCredentials: true, // for cookies later
})

export default api
