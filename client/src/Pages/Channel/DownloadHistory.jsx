"use client"

import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import "./DownloadHistory.css"
import { getDownloadHistory } from "../../action/download"
import { useDispatch } from "react-redux"
import moment from "moment"

const DownloadHistory = ({ userId }) => {
  const dispatch = useDispatch()
  const downloadHistory = useSelector((state) => state.downloadReducer?.history || [])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all") // "all", "today", "week", "month"

  useEffect(() => {
    if (userId) {
      setIsLoading(true)
      dispatch(getDownloadHistory(userId))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
    }
  }, [userId, dispatch])

  const filteredDownloads = () => {
    if (filter === "all") return downloadHistory

    const now = new Date()
    const compareDate = new Date()

    if (filter === "today") {
      compareDate.setHours(0, 0, 0, 0)
    } else if (filter === "week") {
      compareDate.setDate(now.getDate() - 7)
    } else if (filter === "month") {
      compareDate.setMonth(now.getMonth() - 1)
    }

    return downloadHistory.filter((download) => new Date(download.downloadedAt) >= compareDate)
  }

  if (!userId) {
    return (
      <div className="download-history-container">
        <div className="download-history-empty">
          <h3>Please log in to view your download history</h3>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="download-history-container">
        <div className="download-history-loading">
          <div className="download-spinner"></div>
          <p>Loading download history...</p>
        </div>
      </div>
    )
  }

  if (downloadHistory.length === 0) {
    return (
      <div className="download-history-container">
        <div className="download-history-empty">
          <h3>You haven't downloaded any videos yet</h3>
          <p>Videos you download will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="download-history-container">
      <div className="download-history-header">
        <h2>Your Download History</h2>
        <div className="download-history-filters">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
            All Time
          </button>
          <button className={`filter-btn ${filter === "month" ? "active" : ""}`} onClick={() => setFilter("month")}>
            This Month
          </button>
          <button className={`filter-btn ${filter === "week" ? "active" : ""}`} onClick={() => setFilter("week")}>
            This Week
          </button>
          <button className={`filter-btn ${filter === "today" ? "active" : ""}`} onClick={() => setFilter("today")}>
            Today
          </button>
        </div>
      </div>

      <div className="download-stats">
        <div className="stat-box">
          <span className="stat-value">{downloadHistory.length}</span>
          <span className="stat-label">Total Downloads</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">
            {
              downloadHistory.filter(
                (d) => new Date(d.downloadedAt) >= new Date(new Date().setDate(new Date().getDate() - 7)),
              ).length
            }
          </span>
          <span className="stat-label">Last 7 Days</span>
        </div>
        <div className="stat-box">
          <span className="stat-value">{downloadHistory.filter((d) => d.quality === "hd").length}</span>
          <span className="stat-label"></span>
        </div>
      </div>

      <div className="download-history-list">
        {filteredDownloads().map((download) => (
          <div key={download._id} className="download-history-item">
            <div className="download-history-thumbnail">
              <img src={`/placeholder.svg?height=90&width=160`} alt="Video thumbnail" />
              <div className="download-quality-badge">{download.quality}</div>
            </div>
            <div className="download-history-details">
              <h3>{download.videoTitle}</h3>
              <div className="download-meta">
                <p className="download-date">
                  <span className="meta-label">Downloaded:</span>{" "}
                  {moment(download.downloadedAt).format("MMM DD, YYYY [at] h:mm A")}
                </p>
                <p className="download-time-ago">
                  <span className="meta-label">Time:</span> {moment(download.downloadedAt).fromNow()}
                </p>
              </div>
              <div className="download-actions">
                <button className="download-action-btn play-btn">
                  <i className="play-icon">▶</i> Play
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredDownloads().length === 0 && (
        <div className="no-filtered-results">
          <p>No downloads found for the selected time period</p>
        </div>
      )}
    </div>
  )
}

export default DownloadHistory
