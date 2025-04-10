import Download from "../Models/download.js"
import Premium from "../Models/premium.js"

// Download a video
export const downloadVideo = async (req, res) => {
  try {
    const { userId, videoId, videoTitle, quality } = req.body

    // Create a new download record
    const download = new Download({
      userId,
      videoId,
      videoTitle,
      quality: quality || "standard",
    })

    await download.save()

    // Return success response with download details
    res.status(200).json({
      success: true,
      download,
      message: "Download record created successfully",
    })
  } catch (error) {
    console.error("Error downloading video:", error)
    res.status(500).json({ message: error.message })
  }
}

// Get download history for a user
export const getDownloadHistory = async (req, res) => {
  try {
    const { userId } = req.params
    const downloads = await Download.find({ userId }).sort({ downloadedAt: -1 })
    res.status(200).json(downloads)
  } catch (error) {
    console.error("Error fetching download history:", error)
    res.status(500).json({ message: error.message })
  }
}

// Check if user is eligible to download (has not reached daily limit)
export const checkDownloadEligibility = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if user is premium
    const premiumStatus = await Premium.findOne({ userId })
    if (premiumStatus && premiumStatus.isPremium) {
      return res.status(200).json({
        canDownload: true,
        isPremium: true,
        downloadsRemaining: Number.POSITIVE_INFINITY,
      })
    }

    // For non-premium users, check daily download limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Count downloads for today
    const todayDownloads = await Download.countDocuments({
      userId,
      downloadedAt: { $gte: today, $lt: tomorrow },
    })

    // Non-premium users can download 1 video per day
    const dailyLimit = 1
    const downloadsRemaining = Math.max(0, dailyLimit - todayDownloads)

    res.status(200).json({
      canDownload: downloadsRemaining > 0,
      isPremium: false,
      downloadsRemaining,
    })
  } catch (error) {
    console.error("Error checking download eligibility:", error)
    res.status(500).json({ message: error.message })
  }
}
