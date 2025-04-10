import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// In-memory OTP storage (in a real app, this would be in a database)
const emailOtpStore = new Map()

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Create a transporter using SMTP with TLS disabled for development
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Disable certificate validation for development
  },
})

// Function to send OTP email
export const sendOTPEmail = async (email) => {
  try {
    // Generate OTP
    const otp = generateOTP()

    // Store OTP with expiry time (15 minutes)
    emailOtpStore.set(email, {
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      attempts: 0,
    })

    // Email template
    const mailOptions = {
      from: `"Your-Tube Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your-Tube Security Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #333;">Your-Tube Security Verification</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin-bottom: 15px; font-size: 16px;">Hello,</p>
            <p style="margin-bottom: 15px; font-size: 16px;">Your verification code for Your-Tube is:</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="display: inline-block; padding: 15px 30px; background-color: #f0f0f0; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                ${otp}
              </div>
            </div>
            <p style="margin-bottom: 15px; font-size: 16px;">This code will expire in 15 minutes.</p>
            <p style="margin-bottom: 15px; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
          </div>
          <div style="margin-top: 20px; text-align: center; color: #777; font-size: 14px;">
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      `,
    }

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent: %s", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Error sending email:", error)
    return { success: false, error: error.message }
  }
}

// Function to verify email OTP
export const verifyEmailOTP = (email, userEnteredOTP) => {
  // Check if OTP exists for this email
  if (!emailOtpStore.has(email)) {
    return {
      success: false,
      message: "No OTP found for this email. Please request a new OTP.",
    }
  }

  const otpData = emailOtpStore.get(email)

  // Check if OTP has expired
  if (Date.now() > otpData.expiresAt) {
    emailOtpStore.delete(email)
    return {
      success: false,
      message: "OTP has expired. Please request a new OTP.",
    }
  }

  // Increment attempt counter
  otpData.attempts += 1

  // Check if too many attempts
  if (otpData.attempts > 3) {
    emailOtpStore.delete(email)
    return {
      success: false,
      message: "Too many failed attempts. Please request a new OTP.",
    }
  }

  // Verify OTP
  if (otpData.otp === userEnteredOTP) {
    // OTP verified, remove from store
    emailOtpStore.delete(email)
    return {
      success: true,
      message: "OTP verified successfully",
    }
  } else {
    return {
      success: false,
      message: `Invalid OTP. ${3 - otpData.attempts} attempts remaining`,
    }
  }
}
