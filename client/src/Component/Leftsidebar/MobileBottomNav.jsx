import { NavLink } from "react-router-dom"
import { AiOutlineHome, AiFillLike } from "react-icons/ai"
import { MdOutlineExplore, MdOutlineVideoLibrary } from "react-icons/md"
import { FaHistory } from "react-icons/fa"
import "./Leftsidebar.css"

const MobileBottomNav = () => {
  return (
    <div className="mobile_bottom_nav">
      <NavLink to="/" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <AiOutlineHome className="mobile_nav_icon" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/Library" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <MdOutlineVideoLibrary className="mobile_nav_icon" />
        <span>Library</span>
      </NavLink>

      <NavLink to="/Watchhistory" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <FaHistory className="mobile_nav_icon" />
        <span>History</span>
      </NavLink>

      <NavLink to="/Likedvideo" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <AiFillLike className="mobile_nav_icon" />
        <span>Liked</span>
      </NavLink>

      <NavLink to="/Yourvideo" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <MdOutlineExplore className="mobile_nav_icon" />
        <span>Your Videos</span>
      </NavLink>
    </div>
  )
}

export default MobileBottomNav
