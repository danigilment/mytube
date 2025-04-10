import express from "express"
import { getRewardPoints, addRewardPoints } from "../Controllers/rewardpoints.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get reward points for a user
router.get("/:userId", auth, getRewardPoints)

// Add reward points when a user watches a video
router.post("/add", auth, addRewardPoints)

export default router
