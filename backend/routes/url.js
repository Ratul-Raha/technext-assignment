import express from "express"
import {
  createUrl,
  getUrls,
  deleteUrl,
  getUrlStats,
  redirectUrl, // ✅ import the redirect controller
} from "../controllers/urlController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Protected routes: only logged-in users
router.post("/", verifyToken, createUrl)             // Create a short URL
router.get("/", verifyToken, getUrls)               // Get all URLs for the user
router.delete("/:id", verifyToken, deleteUrl)       // Delete a URL by ID
router.get("/:id/stats", verifyToken, getUrlStats) // Optional: get stats of a single URL

// Public route: redirect short URL to original URL
router.get("/:code", redirectUrl)                   // Anyone can access this to redirect

export default router
