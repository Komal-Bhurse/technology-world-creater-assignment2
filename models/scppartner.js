import mongoose from "mongoose";

const scppartnerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: false,
      default: "",    },
    middleName: {
      type: String,
      required: false,
      default: "",    },
    lastName: {
      type: String,
      required: false,
      default: "",    },
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
        required: false,
        default: "",    },
    district:{
        type: String,
        required: false,
        default: "",    },
    pincode:{
        type: String,
        required: false,
        default: "",    },
    pAddress:{
        type: String,
        required: false,
        default: "",
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
