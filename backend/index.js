import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.js"
import urlRoutes from "./routes/url.js"



dotenv.config()

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // needed for auth
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
)

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/url", urlRoutes)
app.use("/", urlRoutes)

await connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
