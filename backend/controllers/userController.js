import bcrypt from "bcrypt"
import User from "../models/User.js"

/* ============================
   GET PROFILE
   GET /user/profile
============================ */

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" })

    // Fetch user from DB
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    // Calculate remaining URL creation chances
    const remainingUrls = user.urlLimit - user.createdUrlCount
    const createdUrls = user.createdUrlCount
   

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      package: user.package,          // send user's package (Free/Pro/etc)
      remainingUrls,    
      createdUrls,           // send remaining URL creation chances
    })
  } catch (err) {
    console.error("Error in getProfile:", err)
    res.status(500).json({ message: "Server error" })
  }
}

/* ============================
   UPDATE PROFILE
   PUT /user/profile
============================ */
export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" })

    const { name, email } = req.body

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    if (name) user.name = name
    if (email) user.email = email

    await user.save()

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Error in updateProfile:", error)
    res.status(500).json({ message: "Failed to update profile" })
  }
}

/* ============================
   CHANGE PASSWORD
   PUT /user/change-password
============================ */
export const changePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" })

    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both passwords are required" })
    }

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Current password is incorrect" })

    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()

    res.json({ message: "Password changed successfully" })
  } catch (error) {
    console.error("Error in changePassword:", error)
    res.status(500).json({ message: "Failed to change password" })
  }
}
