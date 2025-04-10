const rewardPointsReducer = (state = { points: 0 }, action) => {
  switch (action.type) {
    case "FETCH_REWARD_POINTS":
      return action.payload
    case "ADD_REWARD_POINTS":
      return action.payload
    default:
      return state
  }
}

export default rewardPointsReducer
