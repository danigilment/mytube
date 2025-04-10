"use client"

import { useState, useEffect, useRef } from "react"
import { getOTPMethodBasedOnLocation, sendOTP, verifyOTP, resendOTP } from "../../utils/authService"
import "./OTPVerification.css"

const OTPVerification = ({ onVerificationComplete, userEmail, userState }) => {
  const [otpMethod, setOtpMethod] = useState("")
  const [contactInfo, setContactInfo] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1) // 1: Enter contact, 2: Enter OTP
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)
  const [messageType, setMessageType] = useState("") // 'success', 'error', 'info'
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const [fallbackMode, setFallbackMode] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    // Determine OTP method based on user's location
    if (userState) {
      const method = getOTPMethodBasedOnLocation(userState)
      setOtpMethod(method)
      console.log(`User state: ${userState}, using ${method} verification`)

      // Auto-fill email if available and method is email
      if (method === "email" && userEmail) {
        setContactInfo(userEmail)
      }
    } else {
      // Default to email if location can't be determined
      setOtpMethod("email")
      if (userEmail) {
        setContactInfo(userEmail)
      }
    }
  }, [userState, userEmail])

  // Timer for resend OTP
  useEffect(() => {
    let interval
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
      }, 1000)
    } else if (timer === 0 && step === 2) {
      setCanResend(true)
    }

    return () => clearInterval(interval)
  }, [timer, step])

  // Update OTP when digits change
  useEffect(() => {
    setOtp(otpDigits.join(""))
  }, [otpDigits])

  const showMessage = (text, type = "info") => {
    setMessage(text)
    setMessageType(type)
  }

  const handleSendOTP = async () => {
    if (!contactInfo) {
      showMessage("Please enter your contact information", "error")
      return
    }

    // Validate contact info
    if (otpMethod === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactInfo)) {
        showMessage("Please enter a valid email address", "error")
        return
      }
    } else {
      const phoneRegex = /^\d{10}$/
      if (!phoneRegex.test(contactInfo)) {
        showMessage("Please enter a valid 10-digit mobile number", "error")
        return
      }
    }

    try {
      setIsLoading(true)
      showMessage("Sending OTP...", "info")

      const result = await sendOTP(contactInfo, otpMethod)
      setIsLoading(false)

      if (result.success) {
        showMessage(result.message, "success")
        setStep(2)
        setTimer(60) // 60 seconds cooldown for resend
        setCanResend(false)

        // Check if we're using fallback mode
        if (result.fallbackMode) {
          setFallbackMode(true)
          showMessage(
            "Using development mode: The OTP is displayed in the server console. In production, it would be sent to your phone.",
            "info",
          )
        }

        // Focus the first OTP input field
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
          }
        }, 100)
      } else {
        showMessage(result.message || "Failed to send OTP", "error")
      }
    } catch (error) {
      setIsLoading(false)
      showMessage("An error occurred. Please try again.", "error")
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp) {
      showMessage("Please enter the OTP", "error")
      return
    }

    // Validate OTP format
    const otpRegex = /^\d{6}$/
    if (!otpRegex.test(otp)) {
      showMessage("OTP must be a 6-digit number", "error")
      return
    }

    try {
      setIsLoading(true)
      showMessage("Verifying OTP...", "info")

      console.log("Verifying OTP:", { contact: contactInfo, otp, method: otpMethod })

      const result = await verifyOTP(contactInfo, otp, otpMethod)
      setIsLoading(false)

      console.log("OTP verification result:", result)

      if (result.success) {
        showMessage(result.message, "success")

        // Mark user as OTP verified in localStorage
        localStorage.setItem("otpVerified", "true")

        setTimeout(() => {
          if (onVerificationComplete) {
            onVerificationComplete(true)
          }
        }, 1500)
      } else {
        showMessage(result.message || "Invalid OTP", "error")
        setOtp("") // Clear OTP field on failure
        setOtpDigits(["", "", "", "", "", ""])

        // Focus the first OTP input field
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus()
        }
      }
    } catch (error) {
      console.error("OTP verification error:", error)
      setIsLoading(false)
      showMessage("An error occurred during verification.", "error")
    }
  }

  const handleResendOTP = async () => {
    if (!canResend) return

    try {
      setIsLoading(true)
      showMessage("Resending OTP...", "info")

      const result = await resendOTP(contactInfo, otpMethod)
      setIsLoading(false)

      if (result.success) {
        showMessage(result.message, "success")
        setTimer(60) // Reset the timer
        setCanResend(false)

        // Check if we're using fallback mode
        if (result.fallbackMode) {
          setFallbackMode(true)
          showMessage(
            "Using development mode: The OTP is displayed in the server console. In production, it would be sent to your phone.",
            "info",
          )
        }
      } else {
        showMessage(result.message || "Failed to resend OTP", "error")
      }
    } catch (error) {
      setIsLoading(false)
      showMessage("An error occurred. Please try again.", "error")
    }
  }

  // Handle OTP digit input
  const handleOtpDigitChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtpDigits = [...otpDigits]
    newOtpDigits[index] = value
    setOtpDigits(newOtpDigits)

    // Auto-focus next input
    if (value && index < 5) {
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus()
      }
    }
  }

  // Handle backspace in OTP input
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus()

          // Clear the previous input
          const newOtpDigits = [...otpDigits]
          newOtpDigits[index - 1] = ""
          setOtpDigits(newOtpDigits)
        }
      }
    }
  }

  // Handle paste for OTP
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")

    // Check if pasted content is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtpDigits(digits)

      // Focus the last input
      if (inputRefs.current[5]) {
        inputRefs.current[5].focus()
      }
    }
  }

  // Toggle between email and mobile verification
  const toggleVerificationMethod = () => {
    if (step === 1) {
      setOtpMethod(otpMethod === "email" ? "mobile" : "email")
      setContactInfo("")
      showMessage("")
    }
  }

  return (
    <div className="otp-verification-overlay">
      <div className="otp-verification">
        <h2>Security Verification Required</h2>

        {otpMethod === "email" ? (
          <p>We need to verify your email address to ensure account security.</p>
        ) : (
          <p>We need to verify your mobile number to ensure account security.</p>
        )}

        {step === 1 ? (
          <div className="step-container">
            <div className="verification-toggle">
              <button
                className={`toggle-btn ${otpMethod === "email" ? "active" : ""}`}
                onClick={() => setOtpMethod("email")}
              >
                Email
              </button>
              <button
                className={`toggle-btn ${otpMethod === "mobile" ? "active" : ""}`}
                onClick={() => setOtpMethod("mobile")}
              >
                Mobile
              </button>
            </div>

            <label>
              {otpMethod === "email" ? "Email Address:" : "Mobile Number:"}
              <input
                type={otpMethod === "email" ? "email" : "tel"}
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={otpMethod === "email" ? "Enter your email" : "Enter your 10-digit mobile number"}
                disabled={isLoading}
                className="contact-input"
              />
            </label>
            <button onClick={handleSendOTP} className="otp-button" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="step-container">
            <p className="contact-info">
              {otpMethod === "email" ? `OTP sent to: ${contactInfo}` : `OTP sent to: ${contactInfo}`}
            </p>

            {fallbackMode && (
              <div className="fallback-notice">
                <p>
                  <strong>Development Mode:</strong> Check server console for the OTP code.
                </p>
              </div>
            )}

            <label>Enter 6-digit OTP:</label>
            <div className="otp-input-container" onPaste={handlePaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading}
                  className="otp-digit-input"
                  autoComplete="off"
                />
              ))}
            </div>

            <button onClick={handleVerifyOTP} className="otp-button" disabled={isLoading || otp.length !== 6}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="resend-container">
              {timer > 0 ? (
                <p className="resend-timer">Resend OTP in {timer} seconds</p>
              ) : (
                <button
                  onClick={handleResendOTP}
                  className={`resend-button ${canResend ? "active" : "disabled"}`}
                  disabled={!canResend || isLoading}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </div>
        )}

        {message && <p className={`message ${messageType}`}>{message}</p>}

        <div className="otp-footer">
          <p>For security reasons, the OTP will expire in 15 minutes.</p>
          {otpMethod === "email" && <p>Please check both your inbox and spam folder for the OTP email.</p>}
          {otpMethod === "mobile" && <p>Standard SMS rates may apply.</p>}

          {step === 1 && (
            <button onClick={toggleVerificationMethod} className="switch-method-btn">
              {otpMethod === "email" ? "Use mobile number instead" : "Use email instead"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTPVerification
