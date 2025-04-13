"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaDownload } from "react-icons/fa"
import "./DownloadButton.css"
import { downloadVideo, checkDownloadEligibility } from "../../action/download"

const DownloadButton = ({ video, userId }) => {
  const dispatch = useDispatch()
  const [isDownloading, setIsDownloading] = useState(false)
  const [showQualityOptions, setShowQualityOptions] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState(null)

  const premiumStatus = useSelector((state) => state.premiumReducer)
  const isPremium = premiumStatus?.isPremium || false
  // const downloadsRemaining = premiumStatus?.downloadsRemaining || 0

  const handleDownload = (quality) => {
    if (!userId) {
      setDownloadStatus({
        success: false,
        message: "Please log in to download videos",
      })
      return
    }

    setIsDownloading(true)
    setShowQualityOptions(false)

    // First check if user is eligible to download
    dispatch(checkDownloadEligibility(userId))
      .then((response) => {
        // Update local premium status from the response
        const canDownload = response.canDownload
        const userIsPremium = response.isPremium

        if (canDownload || userIsPremium) {
          // User can download, proceed with download
          return dispatch(
            downloadVideo({
              userId,
              videoId: video._id,
              videoTitle: video.videotitle || video.title,
              quality,
            }),
          ).then(() => {
            // Create a direct download link with the video URL
            const encodedFilePath = encodeURIComponent(video.filepath)
            const downloadUrl = `https://mytube-2sa6.onrender.com/video/download/${encodedFilePath}`

            // Create a download link and trigger it
            const downloadLink = document.createElement("a")
            downloadLink.href = downloadUrl
            downloadLink.download = video.filename || `${video.videotitle || "video"}.mp4`
            downloadLink.style.display = "none"

            // Add to document, click, and remove
            document.body.appendChild(downloadLink)
            downloadLink.click()

            // Remove after a delay
            setTimeout(() => {
              document.body.removeChild(downloadLink)
            }, 1000)

            setDownloadStatus({
              success: true,
              message: "Download started successfully!",
            })

            // Clear success message after 3 seconds
            setTimeout(() => {
              setDownloadStatus(null)
            }, 3000)
          })
        } else {
          // User has reached daily limit
          throw new Error("You've reached your daily download limit. Upgrade to premium for unlimited downloads.")
        }
      })
      .catch((error) => {
        setDownloadStatus({
          success: false,
          message: error.message || "Failed to download video. Please try again.",
        })
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const toggleQualityOptions = () => {
    if (!userId) {
      setDownloadStatus({
        success: false,
        message: "Please log in to download videos",
      })
      return
    }

    setShowQualityOptions(!showQualityOptions)
  }

  return (
    <div className="download-button-container">
      <button className="download-button" onClick={toggleQualityOptions} disabled={isDownloading}>
        <FaDownload className="download-icon" />
        <span>{isDownloading ? "Downloading..." : "Download"}</span>
      </button>

      {!isPremium && <div className="download-limit-indicator"></div>}

      {showQualityOptions && (
        <div className="quality-options">
          <div className="quality-option" onClick={() => handleDownload("standard")}>
            Standard Quality
          </div>
          <div
            className={`quality-option ${!isPremium ? "premium-only" : ""}`}
            onClick={() => (isPremium ? handleDownload("hd") : null)}
          >
            {!isPremium && <span className="premium-badge">Premium</span>}
          </div>
          {!isPremium && (
            <div className="premium-upgrade-prompt">
              <div>1 video download per day</div>
              <div>Upgrade to Premium for unlimited downloads </div>
            </div>
          )}
        </div>
      )}

      {downloadStatus && (
        <div className={`download-status ${downloadStatus.success ? "success" : "error"}`}>
          {downloadStatus.message}
        </div>
      )}
    </div>
  )
}

export default DownloadButton
