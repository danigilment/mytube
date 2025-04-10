import express from "express"
import { handleOTPlessCallback, initializeOTPlessLogin } from "../Controllers/otpless.js"

const router = express.Router()

// OTPless callback route
router.get("/callback", handleOTPlessCallback)

// Initialize OTPless login
router.post("/init", initializeOTPlessLogin)

export default router
