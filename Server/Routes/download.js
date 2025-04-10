import express from "express"
import { downloadVideo, getDownloadHistory, checkDownloadEligibility } from "../Controllers/download.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Download a video
router.post("/video", auth, downloadVideo)

// Get download history for a user
router.get("/history/:userId", auth, getDownloadHistory)

// Check if user is eligible to download
router.get("/eligibility/:userId", auth, checkDownloadEligibility)

export default router
