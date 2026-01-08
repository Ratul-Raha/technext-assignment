import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/login.css"
import { loginUser } from "../services/authService"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Password visibility
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please fill all fields")
      return
    }

    try {
      setLoading(true)
      const res = await loginUser({ email, password })

      // Save JWT and user info
      localStorage.setItem("token", res.token)
      localStorage.setItem("user", JSON.stringify(res.user))

      toast.success("Login successful! Redirecting...")
      setTimeout(() => {
        navigate("/dashboard")
      }, 500)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="login-card">
        <h2 className="login-title">TechNext Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password with eye icon */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.359 11.238C12.062 12.85 10.18 14 8 14c-2.18 0-4.062-1.15-5.359-2.762a.5.5 0 0 1 0-.476C3.938 9.15 5.82 8 8 8c2.18 0 4.062 1.15 5.359 2.762a.5.5 0 0 1 0 .476z" />
                  <path d="M11.701 9.5a3.5 3.5 0 1 0-4.202-4.202L11.701 9.5z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" />
                </svg>
              )}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
