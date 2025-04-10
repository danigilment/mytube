const downloadReducer = (state = { history: [], eligibility: null }, action) => {
  switch (action.type) {
    case "DOWNLOAD_VIDEO":
      return { ...state, lastDownload: action.payload }
    case "FETCH_DOWNLOAD_HISTORY":
      return { ...state, history: action.payload }
    case "CHECK_DOWNLOAD_ELIGIBILITY":
      return { ...state, eligibility: action.payload }
    default:
      return state
  }
}

export default downloadReducer
