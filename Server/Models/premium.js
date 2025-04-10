import mongoose from "mongoose"

const premiumSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  plan: {
    type: String,
    enum: ["monthly", "yearly", "lifetime"],
    default: "monthly",
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
  },
  paymentId: {
    type: String,
  },
  amount: {
    type: Number,
  },
})

export default mongoose.model("Premium", premiumSchema)
