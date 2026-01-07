import express from "express"
import {
  register,
  login,
  logout,
} from "../controllers/authController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes (require valid JWT)
router.post("/logout", verifyToken, logout)

export default router
