"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setcurrentuser } from "../../action/currentuser"

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get token and userId from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        const userId = urlParams.get("userId")

        if (!token || !userId) {
          throw new Error("Invalid authentication response")
        }

        // Create user object
        const user = {
          token,
          result: {
            _id: userId,
            otpVerified: true,
          },
        }

        // Save to localStorage
        localStorage.setItem("Profile", JSON.stringify(user))
        localStorage.setItem("otpVerified", "true")

        // Update Redux state
        dispatch(setcurrentuser(user))

        // Redirect to home page
        navigate("/")
      } catch (error) {
        console.error("Authentication callback error:", error)
        setError(error.message || "Authentication failed")
      } finally {
        setLoading(false)
      }
    }

    processCallback()
  }, [dispatch, navigate])

  if (loading) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-loader"></div>
        <p>Completing authentication...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="auth-callback-container">
        <div className="auth-callback-error">
          <h2>Authentication Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Return to Home</button>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback
