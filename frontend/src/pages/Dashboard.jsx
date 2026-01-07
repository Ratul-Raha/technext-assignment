import { useState, useEffect } from "react"
import "../styles/dashboard.css"
import {
  createShortUrl,
  getUrls,
  deleteUrl,
} from "../services/urlService"

export default function Dashboard() {
  const [url, setUrl] = useState("")
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(false)

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const token = localStorage.getItem("token")

  // Fetch all URLs on component mount
  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await getUrls(token)
        setLinks(res)
      } catch (err) {
        console.error("Error fetching URLs:", err)
      }
    }
    fetchUrls()
  }, [token])

  // Create a new short URL
  const handleShorten = async () => {
    if (!url) return
    setLoading(true)
    try {
      const res = await createShortUrl({ originalUrl: url }, token)
      setLinks([res, ...links])
      setUrl("")
      setCurrentPage(1)
    } catch (err) {
      console.error("Error creating URL:", err)
    } finally {
      setLoading(false)
    }
  }

  // Delete a URL
  const handleDelete = async (id) => {
    try {
      await deleteUrl(id, token)
      setLinks(links.filter((l) => l._id !== id))
    } catch (err) {
      console.error("Error deleting URL:", err)
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(links.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedLinks = links.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  return (
    <div className="dashboard">

      {/* Main */}
      <main className="content">
        {/* Topbar */}
        <header className="topbar">
          <h2>Dashboard</h2>
          <div className="avatar">U</div>
        </header>

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
                <th>Short URL</th>
                <th>Original</th>
                <th>Clicks</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedLinks.length === 0 && (
                <tr>
                  <td colSpan="6" className="empty">
                    No links created yet
                  </td>
                </tr>
              )}

              {paginatedLinks.map((l, index) => (
                <tr key={l._id}>
                  <td>{startIndex + index + 1}</td>

                  <td className="short">
                    <a href={l.shortUrl} target="_blank" rel="noreferrer">
                      {l.shortUrl}
                    </a>
                  </td>

                  <td className="truncate">{l.originalUrl}</td>
                  <td>{l.clicks}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString()}</td>

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
  )
}
