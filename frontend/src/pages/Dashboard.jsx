import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import { createShortUrl, getUrls, deleteUrl } from "../services/urlService";
import { getProfile } from "../services/userService";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // User
  const [user, setUser] = useState(null);

  // Avatar menu
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Expanded original URLs
  const [expandedRows, setExpandedRows] = useState({});

  // Copied state (per row)
  const [copiedId, setCopiedId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  /* =========================
     FETCH PROFILE + PACKAGE INFO
  ========================= */
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const data = await getProfile(token);
        setUser(data); // backend sends: { name, email, package, createdUrlCount, urlLimit }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };

    fetchProfile();
  }, [token]);

  /* =========================
     FETCH URLS
  ========================= */
  useEffect(() => {
    if (!token) return;

    const fetchUrls = async () => {
      try {
        const res = await getUrls(token);
        setLinks(res);
      } catch (err) {
        console.error("Error fetching URLs:", err);
      }
    };

    fetchUrls();
  }, [token]);

  /* =========================
     CLOSE AVATAR MENU
  ========================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =========================
     CREATE SHORT URL
  ========================= */
  const handleShorten = async () => {
    if (!url || !token) return;

    setLoading(true);
    try {
      const res = await createShortUrl({ originalUrl: url }, token);

      setLinks((prev) => [res.data, ...prev]);
      setUrl("");
      setCurrentPage(1);

      // Show backend message
      toast.success(res.data?.message || "URL created successfully");

      // Update user's package info from backend response (if sent)
      if (res.data?.remainingUrls !== undefined && user) {
        setUser((prev) => ({
          ...prev,
          createdUrlCount: prev.createdUrlCount + 1, // or use backend remainingUrls
        }));
      }
    } catch (err) {
      console.error("Error creating URL:", err);
      toast.error(err?.response?.data?.message || "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     DELETE URL
  ========================= */
  const handleDelete = async (id) => {
    if (!token) return;

    try {
      await deleteUrl(id, token);
      setLinks((prev) => prev.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Error deleting URL:", err);
    }
  };

  /* =========================
     COPY TO CLIPBOARD
  ========================= */
  const handleCopy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  /* =========================
     LOGOUT
  ========================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.ceil(links.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLinks = links.slice(startIndex, startIndex + itemsPerPage);

  /* =========================
     AVATAR LETTER
  ========================= */
  const avatarLetter = user?.name
    ? user.name.trim().charAt(0).toUpperCase()
    : "U";

  /* =========================
     TOGGLE ORIGINAL URL
  ========================= */
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* =========================
     PACKAGE INFO (from backend)
  ========================= */
  const totalAllowed = user?.urlLimit || 100;
  const usedUrls = user?.createdUrls || 0;
  const remainingUrls = totalAllowed - usedUrls;
  const progressPercent = Math.min((usedUrls / totalAllowed) * 100, 100);

  return (
    <div className="dashboard">
      <ToastContainer />
      <main className="content">
        {/* Topbar */}
        <header className="topbar">
          <h2>Dashboard</h2>

          <div className="avatar-wrapper" ref={menuRef}>
            <button
              className="avatar"
              onClick={() => setShowMenu((v) => !v)}
              title={user?.name || "User"}
            >
              {avatarLetter}
            </button>

            {showMenu && (
              <div className="avatar-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* Package Banner */}
        {user && (
          <div className="package-banner">
            <div className="package-info">
              <strong>Package:</strong> {user.package}
            </div>
            <div className="url-usage">
              <strong>URLs used:</strong> {usedUrls} / {totalAllowed} (
              {remainingUrls} remaining)
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Shorten Box */}
        <section className="shorten-card">
          <input
            type="text"
            placeholder="Paste a long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleShorten} disabled={loading}>
            {loading ? "Shortening..." : "Shorten"}
          </button>
        </section>

        {/* Table */}
        <section className="table-card">
          <table>
            <thead>
              <tr>
                <th>SL</th>
                <th>Original URL</th>
                <th>Short Code</th>
                <th>Short URL</th>
                <th>Clicks</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLinks.length === 0 && (
                <tr>
                  <td colSpan="7" className="empty">
                    No links created yet
                  </td>
                </tr>
              )}

              {paginatedLinks.map((l, index) => (
                <tr key={l._id}>
                  <td>{startIndex + index + 1}</td>

                  <td
                    className={`original-url ${
                      expandedRows[l._id] ? "expanded" : "collapsed"
                    }`}
                    title={l.originalUrl}
                    onClick={() => toggleExpand(l._id)}
                  >
                    {l.originalUrl}
                  </td>

                  <td className="short-code">{l.shortCode}</td>

                  {/* SHORT URL + COPY */}
                  <td className="short-url-cell">
                    <a
                      href={l.shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="short-url-text"
                    >
                      {l.shortUrl}
                    </a>

                    <button
                      className="copy-btn"
                      onClick={() => handleCopy(l._id, l.shortUrl)}
                      title="Copy to clipboard"
                    >
                      {copiedId === l._id ? "✅" : "📋"}
                    </button>
                  </td>

                  <td>{l.clicks}</td>

                  <td>{moment(l.createdAt).format("MMMM DD, YYYY")}</td>

                  <td>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(l._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
