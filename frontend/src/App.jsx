import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import SidebarLayout from "./layout/sidebarLayout" // New layout
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Private route wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token") // your auth logic
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      {/* Toast notifications */}
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
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes using SidebarLayout */}
        <Route
          element={
            <PrivateRoute>
              <SidebarLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
