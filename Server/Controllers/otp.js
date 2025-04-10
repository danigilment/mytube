import { sendOTPEmail } from "../utils/emailService.js"
import { sendOTP, verifyOTP } from "../utils/twoFactorService.js"

// Send OTP via email
export const sendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    // Generate OTP and send email
    const emailResult = await sendOTPEmail(email)

    if (emailResult.success) {
      res.status(200).json({
        success: true,
        message: "OTP sent to your email address",
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again.",
      })
    }
  } catch (error) {
    console.error("Error sending email OTP:", error)
    res.status(500).json({ message: "Failed to send OTP" })
  }
}

// Send OTP via SMS using 2factor.in
export const sendSmsOTP = async (req, res) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" })
    }

    // Validate mobile number format (10 digits for Indian numbers)
    const mobileRegex = /^\d{10}$/
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit mobile number",
      })
    }

    // Send SMS with OTP using 2factor.in
    const smsResult = await sendOTP(mobile)

    if (smsResult.success) {
      res.status(200).json({
        success: true,
        message: "OTP sent to your mobile number",
        fallbackMode: smsResult.fallbackMode || false,
      })
    } else {
      res.status(500).json({
        success: false,
        message: smsResult.error || "Failed to send OTP SMS. Please try again.",
      })
    }
  } catch (error) {
    console.error("Error sending SMS OTP:", error)
    res.status(500).json({ message: error.message || "Failed to send OTP" })
  }
}

// Verify OTP
export const verifyOTPController = async (req, res) => {
  try {
    const { contact, otp, method } = req.body

    if (!contact || !otp) {
      return res.status(400).json({ message: "Contact and OTP are required" })
    }

    let verificationResult

    if (method === "mobile") {
      // Verify mobile OTP
      verificationResult = verifyOTP(contact, otp)
    } else {
      // For email OTP verification
      // Import the email verification function
      const { verifyEmailOTP } = await import("../utils/emailService.js")
      verificationResult = verifyEmailOTP(contact, otp)
    }

    if (verificationResult.success) {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
      })
    } else {
      return res.status(400).json({
        success: false,
        message: verificationResult.message,
      })
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)
    res.status(500).json({ message: "Failed to verify OTP" })
  }
}
