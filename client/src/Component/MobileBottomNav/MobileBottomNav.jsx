import { NavLink } from "react-router-dom"
import { AiOutlineHome, AiFillLike } from "react-icons/ai"
import { MdOutlineVideoLibrary } from "react-icons/md"
import { FaHistory } from "react-icons/fa"
import { BiUserCircle } from "react-icons/bi"
import { useSelector } from "react-redux"

const MobileBottomNav = () => {
  const currentuser = useSelector((state) => state.currentuserreducer)

  return (
    <div className="mobile_bottom_nav">
      <NavLink to="/" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <AiOutlineHome size={20} />
        <span>Home</span>
      </NavLink>

      <NavLink to="/Library" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <MdOutlineVideoLibrary size={20} />
        <span>Library</span>
      </NavLink>

      <NavLink to="/Watchhistory" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <FaHistory size={20} />
        <span>History</span>
      </NavLink>

      <NavLink to="/Likedvideo" className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}>
        <AiFillLike size={20} />
        <span>Liked</span>
      </NavLink>

      {currentuser ? (
        <NavLink
          to={`/channel/${currentuser.result._id}`}
          className={({ isActive }) => `mobile_nav_item ${isActive ? "active" : ""}`}
        >
          <div className="Chanel_logo_App" style={{ width: "1.5rem", height: "1.5rem" }}>
            <p className="fstChar_logo_App" style={{ fontSize: "0.8rem" }}>
              {currentuser?.result.name ? (
                <>{currentuser?.result.name.charAt(0).toUpperCase()}</>
              ) : (
                <>{currentuser?.result.email.charAt(0).toUpperCase()}</>
              )}
            </p>
          </div>
          <span>You</span>
        </NavLink>
      ) : (
        <NavLink to="/" className="mobile_nav_item">
          <BiUserCircle size={20} />
          <span>Sign in</span>
        </NavLink>
      )}
    </div>
  )
}

export default MobileBottomNav
