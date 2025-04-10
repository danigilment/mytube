import mongoose from "mongoose"

const userschema = mongoose.Schema({
  email: { type: String },
  phone: { type: String },
  name: { type: String },
  desc: { type: String },
  joinedon: { type: Date, default: Date.now },
  otpVerified: { type: Boolean, default: false },
})

export default mongoose.model("User", userschema)
