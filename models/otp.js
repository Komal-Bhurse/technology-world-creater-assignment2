import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
    },
    otp:{
        type:String,
        required:true
    }
  },
  {
    timestamps: true,
  }
);

const OTP = mongoose.model("otp", otpSchema);

export default OTP;
