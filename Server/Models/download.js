import mongoose from "mongoose"

const downloadSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  videoTitle: {
    type: String,
    required: true,
  },
  quality: {
    type: String,
    enum: ["standard", "hd"],
    default: "standard",
  },
  downloadedAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("Download", downloadSchema)
