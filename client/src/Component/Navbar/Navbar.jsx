"use client"

import { useState, useEffect, useContext } from "react"
import logo from "./logo.ico"
import "./Navbar.css"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RiVideoAddLine } from "react-icons/ri"
import { IoMdNotificationsOutline } from "react-icons/io"
import { BiUserCircle } from "react-icons/bi"
import Searchbar from "./Searchbar/Searchbar"
import Auth from "../../Pages/Auth/Auth"
import axios from "axios"
import { login } from "../../action/auth"
import { useGoogleLogin, googleLogout } from "@react-oauth/google"
import { setcurrentuser } from "../../action/currentuser"
// import RewardPoints from "./RewardPoints"
import { ThemeContext } from "../../context/ThemeContext"
import OTPVerification from "../OTPVerification/OTPVerification"

import { jwtDecode } from "jwt-decode"

const Navbar = ({ toggledrawer, seteditcreatechanelbtn }) => {
  const [authbtn, setauthbtn] = useState(false)
  const [user, setuser] = useState(null)
  const [profile, setprofile] = useState([])
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  const [isOTPVerified, setIsOTPVerified] = useState(false)
  const { theme, userState } = useContext(ThemeContext)

  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  const dispatch = useDispatch()

  const currentuser = useSelector((state) => state.currentuserreducer)

  const google_login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setuser(tokenResponse)
      // Immediately fetch user info and login after successful Google auth
      if (tokenResponse && tokenResponse.access_token) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenResponse.access_token}`, {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
              Accept: "application/json",
            },
          })
          .then((res) => {
            setprofile(res.data)
            // Call login action with the email
            if (res.data.email) {
              dispatch(login({ email: res.data.email }))

              // Check if user was previously verified
              const otpVerified = localStorage.getItem("otpVerified")
              if (otpVerified === "true") {
                setIsOTPVerified(true)
              } else {
                // Show OTP verification after successful Google login
                setShowOTPVerification(true)
              }
            }
          })
          .catch((error) => {
            console.error("Error fetching user info:", error)
          })
      }
    },
    onError: (error) => console.log("Login Failed", error),
  })

  const logout = () => {
    dispatch(setcurrentuser(null))
    googleLogout()
    localStorage.clear()
    setIsOTPVerified(false)
  }

  useEffect(() => {
    const token = currentuser?.token
    if (token) {
      const decodetoken = jwtDecode(token)
      if (decodetoken.exp * 1000 < new Date().getTime()) {
        logout()
      }
    }
    dispatch(setcurrentuser(JSON.parse(localStorage.getItem("Profile"))))

    // Check if user was previously verified
    const otpVerified = localStorage.getItem("otpVerified")
    if (otpVerified === "true") {
      setIsOTPVerified(true)
    }
  }, [currentuser?.token, dispatch])

  // Handle OTP verification completion
  const handleVerificationComplete = (success) => {
    if (success) {
      setIsOTPVerified(true)
      setShowOTPVerification(false)
      // Store verification status in localStorage
      localStorage.setItem("otpVerified", "true")
    }
  }

  return (
    <>
      <div className={`Container_Navbar ${theme}`}>
        <div className="Burger_Logo_Navbar">
          <div className="burger" onClick={() => toggledrawer()}>
            <p></p>
            <p></p>
            <p></p>
          </div>
          <Link to={"/"} className="logo_div_Navbar">
            <img src={logo || "/placeholder.svg"} alt="" />
            <p className="logo_title_navbar">Your-Tube</p>
          </Link>
        </div>
        <Searchbar />
        <RiVideoAddLine size={22} className={"vid_bell_Navbar"} />
        <div className="apps_Box">
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
          <p className="appBox"></p>
        </div>

        <IoMdNotificationsOutline size={22} className={"vid_bell_Navbar"} />

        {/* {currentuser && isOTPVerified && <RewardPoints />} */}

        <div className="Auth_cont_Navbar">
          {currentuser ? (
            <>
              <div className="Chanel_logo_App" onClick={() => setauthbtn(true)}>
                <p className="fstChar_logo_App">
                  {currentuser?.result.name ? (
                    <>{currentuser?.result.name.charAt(0).toUpperCase()}</>
                  ) : (
                    <>{currentuser?.result.email.charAt(0).toUpperCase()}</>
                  )}
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="Auth_Btn" onClick={() => google_login()}>
                <BiUserCircle size={22} />
                <b>Sign in</b>
              </p>
            </>
          )}
        </div>
      </div>
      {authbtn && <Auth seteditcreatechanelbtn={seteditcreatechanelbtn} setauthbtn={setauthbtn} user={currentuser} />}

      {/* OTP Verification Modal */}
      {showOTPVerification && currentuser && !isOTPVerified && (
        <OTPVerification
          onVerificationComplete={handleVerificationComplete}
          userEmail={currentuser.result.email}
          userState={userState}
        />
      )}
    </>
  )
}

export default Navbar
