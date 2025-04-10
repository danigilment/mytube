import { verifyOTPlessCallback } from "../utils/otplessService.js"
import users from "../Models/Auth.js"
import jwt from "jsonwebtoken"
import { getWhatsAppLoginConfig } from "../utils/otplessService.js"

// Handle OTPless callback
export const handleOTPlessCallback = async (req, res) => {
  try {
    const { code, state } = req.query

    if (!code || !state) {
      return res.status(400).json({ success: false, message: "Missing required parameters" })
    }

    // Verify the OTPless callback
    const verificationResult = await verifyOTPlessCallback(code, state)

    if (!verificationResult.success) {
      return res.status(400).json({ success: false, message: verificationResult.message })
    }

    // Get the phone number from the verification result
    const phoneNumber = verificationResult.phone

    // Find or create user based on phone number
    let user = await users.findOne({ phone: phoneNumber })

    if (!user) {
      // Create a new user if not found
      user = await users.create({
        phone: phoneNumber,
        email: verificationResult.userInfo.email || "",
        name: verificationResult.userInfo.name || `User-${phoneNumber.substring(phoneNumber.length - 4)}`,
        otpVerified: true,
      })
    } else {
      // Update user's OTP verification status
      user.otpVerified = true
      await user.save()
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        phone: user.phone,
        id: user._id,
      },
      process.env.JWT_SECERT,
      {
        expiresIn: "1h",
      },
    )

    // Redirect to the frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth-callback?token=${token}&userId=${user._id}`,
    )
  } catch (error) {
    console.error("OTPless callback error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// Initialize OTPless login
export const initializeOTPlessLogin = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" })
    }

    // Get WhatsApp login configuration
    const loginConfig = getWhatsAppLoginConfig(userId)

    res.status(200).json({
      success: true,
      loginConfig,
    })
  } catch (error) {
    console.error("OTPless initialization error:", error)
    res.status(500).json({ success: false, message: "Internal server error" })
  }
}
