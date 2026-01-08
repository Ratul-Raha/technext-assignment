import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.js"
import urlRoutes from "./routes/url.js"
import userRoutes from "./routes/user.js"

dotenv.config()

const app = express()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
)

app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/url", urlRoutes)
app.use("/", urlRoutes) // public redirect
app.use("/api/user", userRoutes)

try {
  await connectDB()

  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
} catch (error) {
  console.error("❌ MongoDB connection failed:", error.message)
  process.exit(1)
}
