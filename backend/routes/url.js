import express from "express"
import {
  createUrl,
  getUrls,
  deleteUrl,
  getUrlStats,
  redirectUrl,
} from "../controllers/urlController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Protected routes: only logged-in users
router.post("/", verifyToken, createUrl)             
router.get("/", verifyToken, getUrls)               
router.delete("/:id", verifyToken, deleteUrl)       
router.get("/:id/stats", verifyToken, getUrlStats)

// Public route: redirect short URL to original URL
router.get("/:code", redirectUrl)                

export default router
