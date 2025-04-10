import * as api from "../Api"

// Download a video
export const downloadVideo = (downloadData) => async (dispatch) => {
  try {
    const { data } = await api.downloadVideo(downloadData)
    dispatch({ type: "DOWNLOAD_VIDEO", payload: data })
    return data
  } catch (error) {
    console.error("Error downloading video:", error)
    throw error.response?.data?.message || "Failed to download video"
  }
}

// Get download history for a user
export const getDownloadHistory = (userId) => async (dispatch) => {
  try {
    const { data } = await api.getDownloadHistory(userId)
    dispatch({ type: "FETCH_DOWNLOAD_HISTORY", payload: data })
    return data
  } catch (error) {
    console.error("Error fetching download history:", error)
    throw error
  }
}

// Check if user is eligible to download (has not reached daily limit)
export const checkDownloadEligibility = (userId) => async (dispatch) => {
  try {
    const { data } = await api.checkDownloadEligibility(userId)
    dispatch({ type: "CHECK_DOWNLOAD_ELIGIBILITY", payload: data })
    return data
  } catch (error) {
    console.error("Error checking download eligibility:", error)
    throw error.response?.data?.message || "Failed to check download eligibility"
  }
}
