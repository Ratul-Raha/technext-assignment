import jwt from "jsonwebtoken"

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    // Get the token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // Attach user info to request
    req.user = { id: decoded.id }
    // Proceed to the next middleware or route handler
    next()
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" })
  }
}
