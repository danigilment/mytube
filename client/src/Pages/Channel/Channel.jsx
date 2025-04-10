"use client"
import Describechannel from "./Describechannel"
import Leftsidebar from "../../Component/Leftsidebar/Leftsidebar"
import Showvideogrid from "../../Component/Showvideogrid/Showvideogrid"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import RewardPoints from "../../Component/Navbar/RewardPoints"
import DownloadHistory from "./DownloadHistory"
import PremiumStatus from "./PremiumStatus"
import { useState } from "react"

const Channel = ({ seteditcreatechanelbtn, setvideouploadpage }) => {
  const { cid } = useParams()
  const vids = useSelector((state) => state.videoreducer)
    ?.data?.filter((q) => q?.videochanel === cid)
    .reverse()
  const currentuser = useSelector((state) => state.currentuserreducer)
  const [activeTab, setActiveTab] = useState("videos")

  return (
    <div className="container_Pages_App">
      <Leftsidebar />
      <div className="container2_Pages_App">
        <Describechannel
          cid={cid}
          setvideouploadpage={setvideouploadpage}
          seteditcreatechanelbtn={seteditcreatechanelbtn}
        />
           <h2 className="dd">Reward points {currentuser && <RewardPoints />}</h2>
        <div className="channel-tabs">
          <button
            className={`channel-tab ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
          <button
            className={`channel-tab ${activeTab === "downloads" ? "active" : ""}`}
            onClick={() => setActiveTab("downloads")}
          >
            Downloads
          </button>
          <button
            className={`channel-tab ${activeTab === "premium" ? "active" : ""}`}
            onClick={() => setActiveTab("premium")}
          >
            Premium
          </button>
        </div>

        {activeTab === "videos" && <Showvideogrid vid={vids} />}
        {activeTab === "downloads" && <DownloadHistory userId={currentuser?.result?._id} />}
        {activeTab === "premium" && <PremiumStatus userId={currentuser?.result?._id} />}

        
      </div>
    </div>
  )
}

export default Channel
