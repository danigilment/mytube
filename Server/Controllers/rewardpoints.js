import rewardPoints from "../Models/rewardpoints.js"

// Get reward points for a user
export const getRewardPoints = async (req, res) => {
  const { userId } = req.params

  try {
    // Find reward points for the user
    const userPoints = await rewardPoints.findOne({ userId })

    if (!userPoints) {
      return res.status(200).json({ points: 0 })
    }

    res.status(200).json(userPoints)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Add points when a user watches a video
export const addRewardPoints = async (req, res) => {
  const { userId, email } = req.body
  const pointsToAdd = 5 // Add 5 points per video watched

  try {
    // Find if user already has reward points
    let userPoints = await rewardPoints.findOne({ userId })

    if (!userPoints) {
      // Create new reward points record if it doesn't exist
      userPoints = new rewardPoints({
        userId,
        email,
        points: pointsToAdd,
        lastUpdated: new Date(),
      })
    } else {
      // Update existing reward points
      userPoints.points += pointsToAdd
      userPoints.lastUpdated = new Date()
    }

    await userPoints.save()
    res.status(200).json(userPoints)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
