"use client"

import { useEffect, useState } from "react"
import "./Videopage.css"
import moment from "moment"
import Likewatchlatersavebtns from "./Likewatchlatersavebtns"
import { useParams, Link } from "react-router-dom"
import Comment from "../../Component/Comment/Comment"
import { viewvideo } from "../../action/video"
import { addtohistory } from "../../action/history"
import { addRewardPoints } from "../../action/rewardpoints"
import { useSelector, useDispatch } from "react-redux"
import DownloadButton from "./DownloadButton"

const Videopage = () => {
  const { vid } = useParams()
  const dispatch = useDispatch()
  const vids = useSelector((state) => state.videoreducer)
  const vv = vids?.data?.filter((q) => q._id === vid)[0]
  const currentuser = useSelector((state) => state.currentuserreducer)

  // Add state variables to track if actions have been performed
  const [pointsAdded, setPointsAdded] = useState(false)
  const [viewAdded, setViewAdded] = useState(false)
  const [historyAdded, setHistoryAdded] = useState(false)

  const handleviews = () => {
    if (!viewAdded && vid) {
      dispatch(viewvideo({ id: vid }))
      setViewAdded(true)
    }
  }

  const handlehistory = () => {
    if (currentuser?.result?._id && !historyAdded) {
      dispatch(
        addtohistory({
          videoid: vid,
          viewer: currentuser.result._id,
        }),
      )
      setHistoryAdded(true) // Mark history as added to prevent duplicates
    }
  }

  const handleRewardPoints = () => {
    if (currentuser?.result?._id && !pointsAdded) {
      dispatch(
        addRewardPoints({
          userId: currentuser.result._id,
          email: currentuser.result.email,
        }),
      )
      setPointsAdded(true) // Mark points as added to prevent duplicates
    }
  }

  // Use a more controlled useEffect with proper dependencies
  useEffect(() => {
    // Only run this once when component mounts
    if (vid && vv && !viewAdded) {
      handleviews()

      if (currentuser && !historyAdded) {
        handlehistory()
      }

      if (currentuser && !pointsAdded) {
        handleRewardPoints()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vid, vv]) // Removed currentuser from dependencies to prevent double execution

  if (!vv) return <div className="container_videoPage">Loading...</div>

  return (
    <>
      <div className="container_videoPage">
        <div className="container2_videoPage">
          <div className="video_display_screen_videoPage">
            <video src={`http://localhost:5000/${vv?.filepath}`} className="video_ShowVideo_videoPage" controls></video>
            <div className="video_details_videoPage">
              <div className="video_btns_title_VideoPage_cont">
                <p className="video_title_VideoPage">{vv?.title}</p>
                <div className="views_date_btns_VideoPage">
                  <div className="views_videoPage">
                    {vv?.views} views <div className="dot"></div> {moment(vv?.createdat).fromNow()}
                  </div>
                  <div className="video-actions">
                    <DownloadButton video={vv} userId={currentuser?.result?._id} />
                    <Likewatchlatersavebtns vv={vv} vid={vid} />
                  </div>
                </div>
              </div>
              <Link to={"/"} className="chanel_details_videoPage">
                <b className="chanel_logo_videoPage">
                  <p>{vv?.uploader.charAt(0).toUpperCase()}</p>
                </b>
                <p className="chanel_name_videoPage">{vv.uploader}</p>
              </Link>
              <div className="comments_VideoPage">
                <h2>
                  <u>Comments</u>
                </h2>
                <Comment videoid={vv._id} />
              </div>
            </div>
          </div>
          <div className="moreVideoBar">More videos</div>
        </div>
      </div>
    </>
  )
}

export default Videopage
