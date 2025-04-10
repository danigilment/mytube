const premiumReducer = (state = { isPremium: false, downloadsRemaining: 0 }, action) => {
  switch (action.type) {
    case "FETCH_PREMIUM_STATUS":
      return action.payload
    case "UPGRADE_TO_PREMIUM":
      // Ensure we properly update the state with the response data
      return {
        ...state,
        ...action.payload,
        isPremium: action.payload.isPremium || false,
        // Make sure we have these fields even if they're not in the payload
        plan: action.payload.plan || state.plan,
        startDate: action.payload.startDate || new Date(),
        endDate: action.payload.endDate,
      }
    case "PREMIUM_ERROR":
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default premiumReducer
