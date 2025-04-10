import Premium from "../Models/premium.js"
import mongoose from "mongoose"

// Check premium status for a user
export const checkPremiumStatus = async (req, res) => {
  try {
    const { userId } = req.params

    // Check if user has premium
    let premiumStatus = await Premium.findOne({ userId })

    if (!premiumStatus) {
      // If no premium record exists, create one with default values
      premiumStatus = {
        isPremium: false,
        downloadsRemaining: 1, // Default daily limit for free users
      }

      // Check remaining downloads for today
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const Download = mongoose.model("Download")
      const todayDownloads = await Download.countDocuments({
        userId,
        downloadedAt: { $gte: today, $lt: tomorrow },
      })

      premiumStatus.downloadsRemaining = Math.max(0, 1 - todayDownloads)
    } else {
      // If premium record exists but user is not premium, check remaining downloads
      if (!premiumStatus.isPremium) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const Download = mongoose.model("Download")
        const todayDownloads = await Download.countDocuments({
          userId,
          downloadedAt: { $gte: today, $lt: tomorrow },
        })

        premiumStatus = {
          ...premiumStatus.toObject(),
          downloadsRemaining: Math.max(0, 1 - todayDownloads),
        }
      }
    }

    res.status(200).json(premiumStatus)
  } catch (error) {
    console.error("Error checking premium status:", error)
    res.status(500).json({ message: error.message })
  }
}

// Improve the upgradeToPremium controller to handle the payment better
export const upgradeToPremium = async (req, res) => {
  try {
    const { userId, paymentId, plan, amount } = req.body

    if (!userId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information",
      })
    }

    // In a real implementation, you would verify the payment with Razorpay here
    // For simplicity, we'll just accept the payment ID

    // Calculate end date (for lifetime, set to far future)
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setFullYear(endDate.getFullYear() + 100) // 100 years in the future

    // Check if user already has a premium record
    let premiumStatus = await Premium.findOne({ userId })

    if (premiumStatus) {
      // Update existing record
      premiumStatus.isPremium = true
      premiumStatus.plan = plan
      premiumStatus.startDate = startDate
      premiumStatus.endDate = endDate
      premiumStatus.paymentId = paymentId
      premiumStatus.amount = amount

      await premiumStatus.save()
    } else {
      // Create new premium record
      premiumStatus = new Premium({
        userId,
        isPremium: true,
        plan,
        startDate,
        endDate,
        paymentId,
        amount,
      })

      await premiumStatus.save()
    }

    // Return success response with premium details
    res.status(200).json({
      success: true,
      isPremium: true,
      plan,
      startDate,
      endDate,
      message: "Premium upgrade successful",
    })
  } catch (error) {
    console.error("Error upgrading to premium:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process premium upgrade",
    })
  }
}
