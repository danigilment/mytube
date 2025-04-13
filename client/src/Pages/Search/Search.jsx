"use client"
import Leftsidebar from "../../Component/Leftsidebar/Leftsidebar"
import Showvideogrid from "../../Component/Showvideogrid/Showvideogrid"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
const Search = () => {
  const { searchquery } = useParams()
  const vids = useSelector((s) => s?.videoreducer)?.data?.filter((q) =>
    q?.videotitle.toUpperCase().includes(searchquery?.toUpperCase()),
  )

  return (
    <div className="container_Pages_App" style={{ display: "flex", flexDirection: "row" }}>
      <Leftsidebar />
      <div className="container2_Pages_App">
        <Showvideogrid vid={vids} />
      </div>
    </div>
  )
}

export default Search
