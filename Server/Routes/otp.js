import express from "express"
import { sendEmailOTP, sendSmsOTP, verifyOTPController } from "../Controllers/otp.js"

const router = express.Router()

// Send OTP routes
router.post("/send-email", sendEmailOTP)
router.post("/send-sms", sendSmsOTP)

// Verify OTP route
router.post("/verify", verifyOTPController)

export default router
