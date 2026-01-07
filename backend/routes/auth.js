import express from "express"
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  logout,
} from "../controllers/authController.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes (require valid JWT)
router.post("/logout", verifyToken, logout)
router.get("/user/profile", verifyToken, getProfile)
router.put("/user/profile", verifyToken, updateProfile)
router.put("/user/change-password", verifyToken, changePassword)

export default router
