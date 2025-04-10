import axios from "axios"
import dotenv from "dotenv"
import { sendFallbackSMS } from "./fallbackSmsService.js"

dotenv.config()

// In-memory OTP storage (in a real app, this would be in a database)
const otpStore = new Map()

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via 2factor.in
export const sendOTP = async (phoneNumber) => {
  // If no 2factor API key is configured, use the fallback service
  if (!process.env.TWOFACTOR_API_KEY) {
    console.warn("TWOFACTOR_API_KEY not found in environment variables. Using fallback SMS service.")
    const otp = generateOTP()

    // Store OTP with expiry time (15 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
    })

    return sendFallbackSMS(phoneNumber, otp)
  }

  try {
    // Remove any non-digit characters from phone number
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, "")

    // Ensure it's a valid 10-digit Indian mobile number
    if (cleanPhoneNumber.length !== 10) {
      throw new Error("Invalid phone number format. Please provide a 10-digit Indian mobile number.")
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP with expiry time (15 minutes)
    otpStore.set(phoneNumber, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
    })

    // Prepare the API URL for 2factor.in
    const apiUrl = `https://2factor.in/API/V1/${process.env.TWOFACTOR_API_KEY}/SMS/${cleanPhoneNumber}/${otp}/Your-Tube`

    // Make API request to 2factor.in
    const response = await axios.get(apiUrl)

    // Check if the SMS was sent successfully
    if (response.data.Status === "Success") {
      console.log("SMS sent successfully with 2factor.in:", response.data)
      return {
        success: true,
        message: "OTP sent to your mobile number successfully.",
        data: response.data,
      }
    } else {
      console.error("Failed to send SMS with 2factor.in:", response.data)
      return {
        success: false,
        error: response.data.Details || "Failed to send SMS",
      }
    }
  } catch (error) {
    console.error("Error sending SMS with 2factor.in:", error)

    // If there's an API error, try the fallback
    console.log("Attempting to use fallback SMS service...")
    const otp = otpStore.get(phoneNumber)?.otp || generateOTP()

    if (!otpStore.has(phoneNumber)) {
      otpStore.set(phoneNumber, {
        otp,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        attempts: 0,
      })
    }

    return sendFallbackSMS(phoneNumber, otp)
  }
}

// Verify OTP
export const verifyOTP = (phoneNumber, userEnteredOTP) => {
  // Check if OTP exists for this phone number
  if (!otpStore.has(phoneNumber)) {
    return {
      success: false,
      message: "No OTP found for this phone number. Please request a new OTP.",
    }
  }

  const otpData = otpStore.get(phoneNumber)

  // Check if OTP has expired
  if (Date.now() > otpData.expiresAt) {
    otpStore.delete(phoneNumber)
    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    }
  }

  // Increment attempt counter
  otpData.attempts += 1

  // Check if too many attempts
  if (otpData.attempts > 3) {
    otpStore.delete(phoneNumber)
    return {
      success: false,
      message: "Too many failed attempts. Please request a new OTP.",
    }
  }

  // Verify OTP
  if (otpData.otp === userEnteredOTP) {
    // OTP verified, remove from store
    otpStore.delete(phoneNumber)
    return {
      success: true,
      message: "OTP verified successfully",
    }
  } else {
    return {
      success: false,
      message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining`,
    }
  }
}
