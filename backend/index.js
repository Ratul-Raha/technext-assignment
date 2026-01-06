import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Technext backend running" })
})

await connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
