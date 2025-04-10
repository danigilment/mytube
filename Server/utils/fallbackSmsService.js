// Fallback SMS service for development or when no SMS provider is configured
export const sendFallbackSMS = async (phoneNumber, otp) => {
  try {
    // Create a more visible console output
    console.log(`
  ╔═══════════════════════════════════════════════════════════════════════════╗
  ║                       DEVELOPMENT MODE - SIMULATED SMS                    ║
  ╠═══════════════════════════════════════════════════════════════════════════╣
  ║ To: ${phoneNumber.padEnd(65, " ")}║
  ║ Message: Your Your-Tube verification code is: ${otp.padEnd(38, " ")}║
  ║ This code will expire in 15 minutes.                                      ║
  ╠═══════════════════════════════════════════════════════════════════════════╣
  ║ IMPORTANT: In production, this would be sent as a real SMS.               ║
  ║ For testing, use this OTP: ${otp.padEnd(47, " ")}║
  ╚═══════════════════════════════════════════════════════════════════════════╝
      `)

    // Simulate a delay like a real SMS service would have
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      success: true,
      message: "SMS simulated successfully. Check server logs for the OTP.",
      fallbackMode: true, // Flag to indicate we're using the fallback
    }
  } catch (error) {
    console.error("Error in fallback SMS service:", error)
    return { success: false, error: error.message }
  }
}
