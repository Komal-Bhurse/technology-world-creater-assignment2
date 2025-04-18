import mongoose from "mongoose";

const scppartnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique:true
    },
    email: {
      type: String,
      required: false,
      default: "",
    },
    userType: {
      type: String,
      required: false,
      default: "SCP",
    },
    scpID: {
        type: String,
        required: true,
        unique:true
      },
    password: {
      type: String,
      required: true,
    },
    state:{
        type: String,
        required: true,
    },
    district:{
        type: String,
        required: true,
    },
    pincode:{
        type: String,
        required: true,
    },
    pAddress:{
        type: String,
        required: true,
    },
    landMark:{
        type: String,
        required: false,
        default: "",
    },
    officeAddress:{
        type: String,
        required: false,
        default: "",
    },
    scpCertificate:{
        type: String,
        required: false,
        default:""
    },
    officePhoto:{
        type: String,
        required: false,
        default:""
    },
    isMobileVerified:{
      type:Boolean,
      default:false
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
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
  }
);

const SCPPartner = mongoose.model("scppartner", scppartnerSchema);

export default SCPPartner;
