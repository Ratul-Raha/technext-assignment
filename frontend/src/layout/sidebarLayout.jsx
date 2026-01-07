import { NavLink, Outlet } from "react-router-dom"
import "../styles/dashboard.css"

export default function SidebarLayout() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3 className="brand">TechNext</h3>

        <nav>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => (isActive ? "nav active" : "nav")}
          >
            Dashboard
          </NavLink>

        </nav>
      </aside>

      {/* Main content */}
      <main className="content">
        {/* This is where each page will render */}
        <Outlet />
      </main>
    </div>
  )
}
