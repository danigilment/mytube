"use client"

import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import "./PremiumStatus.css"
import { checkPremiumStatus } from "../../action/premium"
import PremiumUpgrade from "./PremiumUpgrade"

const PremiumStatus = ({ userId }) => {
  const dispatch = useDispatch()
  const premiumStatus = useSelector((state) => state.premiumReducer)
  const [isLoading, setIsLoading] = useState(true)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (userId) {
      setIsLoading(true)
      dispatch(checkPremiumStatus(userId))
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false))
    }
  }, [userId, dispatch])

  if (!userId) {
    return (
      <div className="premium-status-container">
        <div className="premium-status-empty">
          <h3>Please log in to view your premium status</h3>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="premium-status-container">
        <div className="premium-status-loading">
          <div className="premium-spinner"></div>
          <p>Loading premium status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="premium-status-container">
      <div className="premium-status-card">
        <div className="premium-status-header">
          <h2>Your-Tube Premium</h2>
          {premiumStatus?.isPremium ? (
            <div className="premium-badge">Lifetime Premium</div>
          ) : (
            <div className="free-badge">Free</div>
          )}
        </div>

        <div className="premium-status-content">
          {premiumStatus?.isPremium ? (
            <>
              <div className="premium-info">
                <p className="premium-message">
                  You're enjoying Your-Tube Premium for life! Download unlimited videos and enjoy premium features
                  forever.
                </p>
                <div className="premium-details">
                  <p>
                    <strong>Subscription started:</strong> {new Date(premiumStatus.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Plan:</strong> Lifetime
                  </p>
                </div>
              </div>
              <div className="premium-features">
                <h3>Your Premium Benefits</h3>
                <ul>
                  <li>✓ Unlimited video downloads</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div className="premium-info">
                <p className="premium-message">Upgrade to Your-Tube Premium to download unlimited videos!</p>
                <div className="free-limits">
                  <p>
                    <strong>Current limit:</strong> 1 video download per day
                  </p>
                  <p>
                    <strong>Downloads available today:</strong> {premiumStatus?.downloadsRemaining || 0} / 1
                  </p>
                </div>
              </div>
              <div className="premium-features">
                <h3>Premium Benefits</h3>
                <ul>
                  <li>✓ Unlimited video downloads</li>
                </ul>
              </div>
              <button className="premium-upgrade-btn" onClick={() => setShowUpgradeModal(true)}>
                Get Lifetime Premium (₹2999)
              </button>
            </>
          )}
        </div>
      </div>

      {showUpgradeModal && <PremiumUpgrade onClose={() => setShowUpgradeModal(false)} userId={userId} />}
    </div>
  )
}

export default PremiumStatus
