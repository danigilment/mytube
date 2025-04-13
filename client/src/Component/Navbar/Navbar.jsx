"use client"

import { useState, useEffect, useContext, useRef } from "react"
import logo from "./logo.ico"
import "./Navbar.css"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { RiVideoAddLine } from "react-icons/ri"
import { IoMdNotificationsOutline } from "react-icons/io"
import { BiUserCircle } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"
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
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { theme, userState } = useContext(ThemeContext)
  const searchBarRef = useRef(null)

  // Apply theme to body element
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  // Toggle mobile search
  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)

    // Focus the search input when opening
    if (!showMobileSearch) {
      setTimeout(() => {
        const searchInput = document.querySelector(".mobile-search-container .iBox_SearchBar")
        if (searchInput) searchInput.focus()
      }, 100)
    }
  }

  // Close mobile search when clicking outside
  const handleClickOutside = (event) => {
    if (
      showMobileSearch &&
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target) &&
      !event.target.classList.contains("search_toggle_btn")
    ) {
      setShowMobileSearch(false)
    }
  }

  // Add event listener for clicks outside
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMobileSearch])

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

        {/* Desktop Search Bar */}
        <div className="desktop-search">
          <Searchbar />
        </div>

        {/* Search toggle button for mobile */}
        <button className="search_toggle_btn" onClick={toggleMobileSearch}>
          <FaSearch />
        </button>

        <RiVideoAddLine size={22} className={"vid_bell_Navbar"} />
        <div className="apps_Box">
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
          <div className="appBox"></div>
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

      {/* Mobile Search Overlay */}
      <div
        className={`mobile-search-overlay ${showMobileSearch ? "active" : ""}`}
        onClick={() => setShowMobileSearch(false)}
      >
        <div className="mobile-search-container" ref={searchBarRef} onClick={(e) => e.stopPropagation()}>
          <Searchbar isMobile={true} />
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
