"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { FaStar } from "react-icons/fa"
import { getRewardPoints } from "../../action/rewardpoints"
import "./RewardPoints.css"

const RewardPoints = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentuserreducer)
  const rewardPoints = useSelector((state) => state.rewardPointsReducer)

  useEffect(() => {
    if (currentUser?.result?._id) {
      dispatch(getRewardPoints(currentUser.result._id))
    }
  }, [currentUser, dispatch])

  if (!currentUser) {
    return null
  }

  return (
    <div className="reward-points-container">
      <FaStar className="reward-points-icon" size={20} />
      <span className="reward-points-value">{rewardPoints?.points || 0}</span>
      <div className="reward-points-tooltip">
        You have {rewardPoints?.points || 0} reward points! Earn 5 points for each video you watch.
      </div>
    </div>
  )
}

export default RewardPoints
