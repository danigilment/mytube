"use client"

import { useState, useEffect } from "react"
import "./OTPlessLogin.css"
import { useDispatch } from "react-redux"
import { setcurrentuser } from "../../action/currentuser"

const OTPlessLogin = ({ onLoginComplete }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    // Check if this is a callback from OTPless
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get("token")
    const userId = urlParams.get("userId")

    if (token && userId) {
      handleOTPlessCallback(token, userId)
    }

    // Load OTPless script
    const script = document.createElement("script")
    script.src = "https://otpless.com/auth.js"
    script.async = true
    document.body.appendChild(script)

    // Initialize OTPless
    window.otpless = (otplessUser) => {
      if (otplessUser) {
        handleOTPlessUser(otplessUser)
      }
    }

    return () => {
      document.body.removeChild(script)
      delete window.otpless
    }
  }, [])

  const handleOTPlessCallback = (token, userId) => {
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)

    // Create user object from callback data
    const user = {
      token,
      result: {
        _id: userId,
        otpVerified: true,
      },
    }

    // Save user to localStorage
    localStorage.setItem("Profile", JSON.stringify(user))
    localStorage.setItem("otpVerified", "true")

    // Update Redux state
    dispatch(setcurrentuser(user))

    // Notify parent component
    if (onLoginComplete) {
      onLoginComplete(true)
    }
  }

  const handleOTPlessUser = async (otplessUser) => {
    try {
      setIsLoading(true)
      setError(null)

      // Extract user data
      const { phoneNumber, email, name } = otplessUser

      // Call your backend to create/login user
      const response = await fetch("/api/auth/otpless-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          email,
          name,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Save user to localStorage
        localStorage.setItem("Profile", JSON.stringify(data.user))
        localStorage.setItem("otpVerified", "true")

        // Update Redux state
        dispatch(setcurrentuser(data.user))

        // Notify parent component
        if (onLoginComplete) {
          onLoginComplete(true)
        }
      } else {
        setError(data.message || "Login failed")
      }
    } catch (error) {
      console.error("OTPless login error:", error)
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="otpless-login-container">
      <h2>Quick Authentication</h2>
      <p>Verify your identity instantly with WhatsApp</p>

      {error && <div className="otpless-error">{error}</div>}

      <div className="otpless-buttons">
        <button
          id="whatsapp-login"
          className="otpless-button whatsapp-button"
          onClick={() => window.otplessWAInit()}
          disabled={isLoading}
        >
          <img src="https://cdn.otpless.app/whatsapp-icon.png" alt="WhatsApp" className="otpless-icon" />
          Continue with WhatsApp
        </button>
      </div>

      <div className="otpless-divider">
        <span>OR</span>
      </div>
    </div>
  )
}

export default OTPlessLogin
