import { combineReducers } from "redux"
import authreducer from "./auth"
import currentuserreducer from "./currentuser"
import chanelreducer from "./chanel"
import videoreducer from "./video"
import commentreducer from "./comment"
import historyreducer from "./history"
import likedvideoreducer from "./likedvideo"
import watchlaterreducer from "./watchlater"
import rewardPointsReducer from "./rewardpoints"
import downloadReducer from "./download"
import premiumReducer from "./premium"

export default combineReducers({
  authreducer,
  currentuserreducer,
  videoreducer,
  chanelreducer,
  commentreducer,
  historyreducer,
  likedvideoreducer,
  watchlaterreducer,
  rewardPointsReducer,
  downloadReducer,
  premiumReducer,
})
