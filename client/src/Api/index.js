import axios from "axios"
const API = axios.create({ baseURL: `https://mytube-2sa6.onrender.com/` })

API.interceptors.request.use((req) => {
  if (localStorage.getItem("Profile")) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem("Profile")).token}`
  }
  return req
})

export const login = (authdata) => API.post("/user/login", authdata)
export const updatechaneldata = (id, updatedata) => API.patch(`/user/update/${id}`, updatedata)
export const fetchallchannel = () => API.get("/user/getallchannel")

export const uploadvideo = (filedata, fileoption) => API.post("/video/uploadvideo", filedata, fileoption)
export const getvideos = () => API.get("/video/getvideos")
export const likevideo = (id, Like) => API.patch(`/video/like/${id}`, { Like })
export const viewsvideo = (id) => API.patch(`/video/view/${id}`)

export const postcomment = (commentdata) => API.post("/comment/post", commentdata)
export const deletecomment = (id) => API.delete(`/comment/delete/${id}`)
export const editcomment = (id, commentbody) => API.patch(`/comment/edit/${id}`, { commentbody })
export const getallcomment = () => API.get("/comment/get")

export const addtohistory = (historydata) => API.post("/video/history", historydata)
export const getallhistory = () => API.get("/video/getallhistory")
export const deletehistory = (userid) => API.delete(`/video/deletehistory/${userid}`)

export const addtolikevideo = (likedvideodata) => API.post("/video/likevideo", likedvideodata)
export const getalllikedvideo = () => API.get("/video/getalllikevide")
export const deletelikedvideo = (videoid, viewer) => API.delete(`/video/deletelikevideo/${videoid}/${viewer}`)

export const addtowatchlater = (watchlaterdata) => API.post("/video/watchlater", watchlaterdata)
export const getallwatchlater = () => API.get("/video/getallwatchlater")
export const deletewatchlater = (videoid, viewer) => API.delete(`/video/deletewatchlater/${videoid}/${viewer}`)

// Reward Points API endpoints
export const getRewardPoints = (userId) => API.get(`/rewardpoints/${userId}`)
export const addRewardPoints = (rewardPointsData) => API.post("/rewardpoints/add", rewardPointsData)

// OTP API endpoints
export const sendEmailOTP = (email) => API.post("/otp/send-email", { email })
export const sendSmsOTP = (mobile) => API.post("/otp/send-sms", { mobile })
export const verifyOTP = (contact, otp, method) => API.post("/otp/verify", { contact, otp, method })

// Download API endpoints
// Add Content-Disposition header to ensure browser treats response as downloadable
export const downloadVideo = (downloadData) =>
  API.post("/download/video", downloadData, {
    responseType: "blob", // This tells axios to handle the response as a binary blob
  })
export const getDownloadHistory = (userId) => API.get(`/download/history/${userId}`)
export const checkDownloadEligibility = (userId) => API.get(`/download/eligibility/${userId}`)

// Premium API endpoints
export const checkPremiumStatus = (userId) => API.get(`/premium/status/${userId}`)
export const upgradeToPremium = (paymentData) => API.post("/premium/upgrade", paymentData)
