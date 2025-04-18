import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      default: "",
    },
    middleName: {
      type: String,
      required: false,
      default: "",
    },
    lastName: {
      type: String,
      required: false,
      default: "",
    },
    mobile: {
      type: String,
      required: true,
      unique:true
    },
    dob: {
      type: Date,
      required: false,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "NotSpecified"],
      required: false,
      default: "NotSpecified",
    },
    newBusiness: {
      type: String,
      enum: ["Yes", "No", "NotSpecified"],
      required: false,
      default: "NotSpecified",
      
    },
    farmerPhoto: {
      type: String,
      required: false,
      default: "",
    },
    state: {
      type: String,
      required: false,
      default: "",
    },
    district: {
      type: String,
      required: false,
      default: "",
    },
    taluka: {
      type: String,
      required: false,
      default: "",
    },
    village: {
      type: String,
      required: false,
      default: "",
    },
    pincode: {
      type: String,
      required: false,
      default: "",
    },
    streetAddress: {
      type: String,
      required: false,
      default: "",
    },
    residencialType: {
      type: String,
      enum: ["Rural", "Urban", "NotSpecified"],
      required: false,
      default: "NotSpecified",
    },
    farmerType: {
      type: String,
      enum: [
        "Traditional-(Very small farmer, typically does farming on rented land.)",
        "Small-(0.5 Acre - 5 Acre)",
        "Medium-(6 Acre - 15 Acre)",
        "Large-(16 Acre - 30 Acre)",
        "Commercial-(Above 30 Acre)",
        "notSpecified",
      ],
      required: false,
      default: "notSpecified",
    },
    cropsGrown: {
      type: String,
      required: false,
      default: "",
    },
    whereYouSell: {
      type: String,
      required: false,
      default: "",
    },
    landState: {
      type: String,
      required: false,
      default: "",
    },
    landDistrict: {
      type: String,
      required: false,
      default: "",
    },
    landTaluka: {
      type: String,
      required: false,
      default: "",
    },
    landServeyNo: {
      type: String,
      required: false,
      default: "",
    },
    landSubServeyNo: {
      type: String,
      required: false,
      default: "",
    },
    landownerName: {
      type: String,
      required: false,
      default: "",
    },
    addedBy: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["New", "Active", "Inactive", "Deleted"],
      required: false,
      default: "New",
    },
  },
  {
    timestamps: true,
  }
);

const Farmer = mongoose.model("farmer", farmerSchema);

export default Farmer;
