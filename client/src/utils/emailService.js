import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Function to send OTP email
export const sendOTPEmail = async (email, otp) => {
  try {
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

// Function to send OTP SMS (this would connect to an SMS service in a real app)
export const sendOTPSMS = async (phoneNumber, otp) => {
  try {
    // In a real app, you would integrate with an SMS service like Twilio
    console.log(`SMS would be sent to ${phoneNumber} with OTP: ${otp}`)

    // For demo purposes, we'll simulate a successful SMS send
    return { success: true, message: "SMS sent successfully" }
  } catch (error) {
    console.error("Error sending SMS:", error)
    return { success: false, error: error.message }
  }
}
