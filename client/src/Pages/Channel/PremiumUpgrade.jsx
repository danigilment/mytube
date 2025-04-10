"use client"

import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import "./PremiumUpgrade.css"
import { upgradeToPremium, checkPremiumStatus } from "../../action/premium"

const PremiumUpgrade = ({ onClose, userId }) => {
  const dispatch = useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)

  // Initialize Razorpay when component mounts
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  // Update the handlePayment function to better handle the Razorpay callback
  const handlePayment = () => {
    setIsProcessing(true)
    setPaymentStatus(null)

    // Simple plan details
    const planDetails = {
      amount: 2999,
      currency: "INR",
      name: "Lifetime Premium",
      description: "Your-Tube Premium Lifetime Access",
      duration: 36500, // ~100 years (effectively lifetime)
    }

    // Create Razorpay options with provided credentials
    const options = {
      key: "rzp_test_Sj6P9YlqMYnjvY", // Using the provided key
      amount: planDetails.amount * 100, // Amount in paisa
      currency: planDetails.currency,
      name: "Your-Tube",
      description: planDetails.description,
      handler: (response) => {
        console.log("Payment successful, ID:", response.razorpay_payment_id)

        // Payment successful
        const paymentData = {
          userId,
          paymentId: response.razorpay_payment_id,
          plan: "lifetime",
          amount: planDetails.amount,
          duration: planDetails.duration,
        }

        // Dispatch action to update premium status
        dispatch(upgradeToPremium(paymentData))
          .then((result) => {
            console.log("Premium upgrade result:", result)

            setPaymentStatus({
              success: true,
              message: "Payment successful! You now have lifetime premium access.",
            })

            // Refresh premium status in the app
            dispatch(checkPremiumStatus(userId))

            setTimeout(() => {
              onClose()
              // Reload the page to reflect premium status changes
              window.location.reload()
            }, 3000)
          })
          .catch((error) => {
            console.error("Premium upgrade error:", error)
            setPaymentStatus({
              success: false,
              message: error.message || "Payment processed but failed to activate premium. Please contact support.",
            })
          })
          .finally(() => {
            setIsProcessing(false)
          })
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3ea6ff",
      },
      modal: {
        ondismiss: () => {
          console.log("Payment modal closed")
          setIsProcessing(false)
        },
      },
    }

    // Create Razorpay instance and open payment modal
    try {
      console.log("Initializing Razorpay with options:", options)
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error("Razorpay initialization error:", error)
      setIsProcessing(false)
      setPaymentStatus({
        success: false,
        message: "Failed to initialize payment gateway. Please try again.",
      })
    }
  }

  return (
    <div className="premium-upgrade-simple">
      <div className="premium-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>Upgrade to Lifetime Premium</h2>

        <div className="premium-details">
          <p className="price">
            ₹2999 <span>one-time payment</span>
          </p>
          <ul>
            <li>✓ Unlimited downloads forever</li>
           
            <li>✓ No ads</li>
          </ul>
        </div>

        {paymentStatus && (
          <div className={`status-message ${paymentStatus.success ? "success" : "error"}`}>{paymentStatus.message}</div>
        )}

        <button className="payment-btn" onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay ₹2999"}
        </button>
      </div>
    </div>
  )
}

export default PremiumUpgrade
