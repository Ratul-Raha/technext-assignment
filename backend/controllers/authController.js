import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Password rules: min 8 chars, 1 number, 1 special char
const passwordRegex =
  /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  })
}

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" })
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters, include a number and a special character",
      })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Set default package info for new user
    const defaultPackage = "Free"

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      createdUrlCount: 0,
    })

    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        package: user.package,
        remainingUrls: user.urlLimit - user.createdUrlCount,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error" })
  }
}


// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const logout = async (req, res) => {
  res.json({ message: "Logout successful" })
}
