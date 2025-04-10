import * as api from "../Api"

// Check premium status for a user
export const checkPremiumStatus = (userId) => async (dispatch) => {
  try {
    const { data } = await api.checkPremiumStatus(userId)
    dispatch({ type: "FETCH_PREMIUM_STATUS", payload: data })
    return data
  } catch (error) {
    console.error("Error checking premium status:", error)
    dispatch({ type: "PREMIUM_ERROR", payload: error.message })
    throw error
  }
}

// Improve the upgradeToPremium action to handle errors better
export const upgradeToPremium = (paymentData) => async (dispatch) => {
  try {
    console.log("Processing payment with data:", paymentData)
    const { data } = await api.upgradeToPremium(paymentData)

    // Dispatch the action to update the Redux store
    dispatch({ type: "UPGRADE_TO_PREMIUM", payload: data })

    // Return the data for the component to handle
    return data
  } catch (error) {
    console.error("Error upgrading to premium:", error)

    // Dispatch error action
    dispatch({
      type: "PREMIUM_ERROR",
      payload: error.response?.data?.message || error.message || "Failed to upgrade to premium",
    })

    // Re-throw the error for the component to handle
    throw error
  }
}
