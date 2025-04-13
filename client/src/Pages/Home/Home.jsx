"use client"

import Leftsidebar from "../../Component/Leftsidebar/Leftsidebar"
import "./Home.css"
import Showvideogrid from "../../Component/Showvideogrid/Showvideogrid"
import { useSelector } from "react-redux"
import { useState } from "react"

const Home = () => {
  const vids = useSelector((state) => state.videoreducer)
    ?.data?.filter((q) => q)
    .reverse()

  const [activeCategory, setActiveCategory] = useState("All")

  const navlist = ["All", "Python", "Java", "C++", "Movies", "Science", "Animation", "Gaming", "Comedy"]

  return (
    <div className="container_Pages_App" style={{ display: "flex", flexDirection: "row" }}>
      <Leftsidebar />
      <div className="container2_Pages_App">
        <div className="navigation_Home">
          {navlist.map((category) => {
            return (
              <p
                key={category}
                className={`btn_nav_home ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </p>
            )
          })}
        </div>
        <Showvideogrid vid={vids} />
      </div>
    </div>
  )
}

export default Home
