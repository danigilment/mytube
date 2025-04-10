"use client"

import "./App.css"
import { useEffect, useState } from "react"
import Navbar from "./Component/Navbar/Navbar"
import { useDispatch } from "react-redux"
import Allroutes from "../src/Allroutes"
import { BrowserRouter as Router } from "react-router-dom"
import Drawersliderbar from "../src/Component/Leftsidebar/Drawersliderbar"
import Createeditchannel from "./Pages/Channel/Createeditchannel"
import Videoupload from "./Pages/Videoupload/Videoupload"
import { fetchallchannel } from "./action/channeluser"
import { getallvideo } from "./action/video"
import { getallcomment } from "./action/comment"
import { getallhistory } from "./action/history"
import { getalllikedvideo } from "./action/likedvideo"
import { getallwatchlater } from "./action/watchlater"
import { getRewardPoints } from "./action/rewardpoints"
import { ThemeProvider } from "./context/ThemeContext"

function App() {
  const [toggledrawersidebar, settogledrawersidebar] = useState({
    display: "none",
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchallchannel())
    dispatch(getallvideo())
    dispatch(getallcomment())
    dispatch(getallhistory())
    dispatch(getalllikedvideo())
    dispatch(getallwatchlater())

    // Get reward points for the current user if logged in
    const currentUser = JSON.parse(localStorage.getItem("Profile"))
    if (currentUser?.result?._id) {
      dispatch(getRewardPoints(currentUser.result._id))
    }
  }, [dispatch])

  const toggledrawer = () => {
    if (toggledrawersidebar.display === "none") {
      settogledrawersidebar({
        display: "flex",
      })
    } else {
      settogledrawersidebar({
        display: "none",
      })
    }
  }
  const [editcreatechanelbtn, seteditcreatechanelbtn] = useState(false)
  const [videouploadpage, setvideouploadpage] = useState(false)

  return (
    <ThemeProvider>
      <Router>
        {videouploadpage && <Videoupload setvideouploadpage={setvideouploadpage} />}
        {editcreatechanelbtn && <Createeditchannel seteditcreatechanelbtn={seteditcreatechanelbtn} />}
        <Navbar seteditcreatechanelbtn={seteditcreatechanelbtn} toggledrawer={toggledrawer} />
        <Drawersliderbar toggledraw={toggledrawer} toggledrawersidebar={toggledrawersidebar} />
        <Allroutes seteditcreatechanelbtn={seteditcreatechanelbtn} setvideouploadpage={setvideouploadpage} />
      </Router>
    </ThemeProvider>
  )
}

export default App
