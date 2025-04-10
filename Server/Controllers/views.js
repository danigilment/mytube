import videofile from "../Models/videofile.js"
import mongoose from "mongoose"

export const viewscontroller = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("video unavailable..")
  }

  try {
    // Find the video by ID first
    const video = await videofile.findById(_id)

    if (!video) {
      return res.status(404).send("Video not found")
    }

    // Use findOneAndUpdate with $inc operator for atomic update to prevent race conditions
    const updatedVideo = await videofile.findOneAndUpdate({ _id: _id }, { $inc: { views: 1 } }, { new: true })

    res.status(200).json(updatedVideo)
  } catch (error) {
    console.error("Error updating view count:", error)
    res.status(400).json({ error: error.message })
  }
}
