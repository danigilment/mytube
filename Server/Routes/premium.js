import express from "express"
import { checkPremiumStatus, upgradeToPremium } from "../Controllers/premium.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Check premium status for a user
router.get("/status/:userId", auth, checkPremiumStatus)

// Upgrade user to premium
router.post("/upgrade", auth, upgradeToPremium)

export default router
