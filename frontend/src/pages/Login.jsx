import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/login.css"
import { loginUser } from "../services/authService"
import { toast } from "react-toastify"

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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
      navigate("/dashboard")
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">TechNext Login</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
