import { Navigate } from "react-router-dom"

const AuthGuard = ({ children }) => {
  // Check if user is logged in and OTP verified
  const isLoggedIn = localStorage.getItem("Profile") !== null
  const isOTPVerified = localStorage.getItem("otpVerified") === "true"

  // If user is logged in but not OTP verified, show a message
  if (isLoggedIn && !isOTPVerified) {
    return (
      <div className="auth-guard-message">
        <h2>Verification Required</h2>
        <p>Please complete the OTP verification process to access this content.</p>
        <p>Sign out and sign in again to trigger the verification process.</p>
      </div>
    )
  }

  // If user is not logged in, redirect to home
  if (!isLoggedIn) {
    return <Navigate to="/" />
  }

  // If user is logged in and OTP verified, show the protected content
  return children
}

export default AuthGuard
