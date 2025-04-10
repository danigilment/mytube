import * as api from "../Api"

// Action to get reward points for a user
export const getRewardPoints = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getRewardPoints(userId)
    dispatch({ type: "FETCH_REWARD_POINTS", payload: data })
  } catch (error) {
    console.log(error)
  }
}

// Action to add reward points when a user watches a video
export const addRewardPoints = (rewardPointsData) => async (dispatch) => {
  try {
    // Add a timestamp to prevent duplicate requests
    const requestData = {
      ...rewardPointsData,
      timestamp: new Date().getTime(),
    }

    const { data } = await api.addRewardPoints(requestData)
    dispatch({ type: "ADD_REWARD_POINTS", payload: data })

    // Fetch updated points after adding
    dispatch(getRewardPoints(rewardPointsData.userId))
  } catch (error) {
    console.log(error)
  }
}
