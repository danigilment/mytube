import { isLocationSouthIndia } from "./themeUtils"
import * as api from "../Api"

// Function to determine OTP verification method based on location
export const getOTPMethodBasedOnLocation = (state) => {
  // Check if the state is in South India
  if (isLocationSouthIndia(state)) {
    return "email" // Use email OTP for South Indian states
  } else {
    return "mobile" // Use mobile OTP for other states
  }
}

// Function to send OTP
export const sendOTP = async (contactInfo, method) => {
  try {
    let response

    if (method === "email") {
      response = await api.sendEmailOTP(contactInfo)
      return {
        success: true,
        message: `OTP sent to your email address (${contactInfo}). Please check your inbox and spam folder.`,
      }
    } else {
      response = await api.sendSmsOTP(contactInfo)

      // Check if we're using the fallback mode
      const fallbackMode = response.data && response.data.fallbackMode

      return {
        success: true,
        message: `OTP sent to your mobile number (${contactInfo}).`,
        fallbackMode: fallbackMode,
      }
    }
  } catch (error) {
    console.error("Error sending OTP:", error)

    if (error.response && error.response.data) {
      return { success: false, message: error.response.data.message }
    }

    return { success: false, message: "Failed to send OTP. Please try again." }
  }
}

// Function to verify OTP
export const verifyOTP = async (contactInfo, enteredOTP, method) => {
  try {
    console.log("Sending verification request:", { contact: contactInfo, otp: enteredOTP, method })

    const response = await api.verifyOTP(contactInfo, enteredOTP, method)

    console.log("Verification API response:", response)

    // If the response has data property, return it
    if (response.data) {
      return response.data
    }

    // Otherwise, return a default success response
    return {
      success: true,
      message: "OTP verified successfully",
    }
  } catch (error) {
    console.error("Error verifying OTP:", error)

    if (error.response && error.response.data) {
      return { success: false, message: error.response.data.message }
    }

    return { success: false, message: "Verification failed. Please try again." }
  }
}

// Function to resend OTP
export const resendOTP = async (contactInfo, method) => {
  // Send a new OTP
  return sendOTP(contactInfo, method)
}
