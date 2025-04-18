import dotenv from "dotenv";
import twilio from "twilio";
import OtpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import OTP from "../models/otp.js";
import SCPPartner from "../models/scppartner.js";
import { generateToken } from "../services/auth.js";
import fs from "fs";
import path from "path";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const client = twilio(accountSid, authToken);

const SendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || mobile.length !== 10) {
      return res.status(404).json({
        status: "failed",
        message: "Please enter your mobile Number",
        data: "",
        error: "",
      });
    }

    const otp = OtpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await OTP.create({ mobile, otp });

    const response = await client.messages.create({
      body: `Your OTP is ${otp}. It is valid for 5 minits Do not share it with anyone. - [TWC]`,
      from: twilioPhone,
      to: `+91${mobile}`,
    });

    return res.status(201).json({
      status: "success",
      message:
        "OTP has been sent successfully on your registered mobile number",
      data: "",
      error: "",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: error.message, data: "" });
  }
};

const VerifyOTP = async (req, res, next) => {
  try {
    const body = req.body;
    const { mobile, otp } = body;

    if (!otp) {
      return res.status(404).json({
        status: "failed",
        message: "Please enter your OTP",
        data: "",
        error: "",
      });
    }

    if (otp.length !== 6) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid OTP",
        data: "",
        error: "",
      });
    }

    const response = await OTP.findOne({ mobile }).sort({ createdAt: -1 });

    if (!response || response.otp !== otp) {
      return res.status(404).json({
        status: "failed",
        message: "Invalid OTP",
        data: "",
        error: "",
      });
    }

    const otpSetTime = new Date(response?.createdAt);

    const currentTime = new Date();

    const differenceInSecond = (currentTime - otpSetTime) / 1000;

    if (differenceInSecond > 60) {
      return res.status(404).json({
        status: "failed",
        message: "OTP has expired",
        data: "",
        error: "",
      });
    }

    delete req.body.otp;
    req.body.isMoblileVerified = true;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ status: "failed", message: error.message, data: "" });
  }
};

const Register = async (req, res) => {
  try {
    const body = req.body;

    const {
      firstName,
      middleName,
      lastName,
      mobile,
      scpID,
      password,
      state,
      district,
      pincode,
      pAddress,
    } = body;

    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !mobile ||
      !scpID ||
      !password ||
      !state ||
      !district ||
      !pincode ||
      !pAddress
    ) {
      return res.status(404).json({
        status: "failed",
        message: "Please fill the requred data",
        data: "",
        error: "",
      });
    }

    const user = await SCPPartner.findOne({ mobile });

    if (user) {
      return res
        .status(400)
        .json({ message: "The Mobile number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await SCPPartner.create({
      ...body,
      password: hashedPassword,
    });

    const scpUserID = response?._id?.toString();

    const userDir = path.resolve(`./uploads/${scpUserID}`);
    fs.mkdirSync(userDir, { recursive: true });

    const updatedPaths = {};

    for (const field of ["scpCertificate", "officePhoto"]) {
      const file = req.files?.[field]?.[0];
      if (file) {
        const oldPath = file.path;
        const newPath = path.join(userDir, file.filename);
        fs.renameSync(oldPath, newPath);
        updatedPaths[`${field}`] = `uploads/${scpUserID}/${file.filename}`;
      }
    }

    const response2 = await SCPPartner.findByIdAndUpdate(
      scpUserID,
      updatedPaths,
      {new:true}
    );

    const token = generateToken(response2);

    res.cookie("twc_uid2", token, {
        secure: true,
        httpOnly:true,
        domain: "technology-world-creater-assignment2.vercel.app",
    });

    return res.status(201).json({
      status: "success",
      message: "OTP verified Successfully",
      data: response2,
    });
  } catch (error) {
    const fields = ["scpCertificate", "officePhoto"];
    fields.forEach((field) => {
      const file = req.files?.[field]?.[0];
      if (file && file.path) {
        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            // console.error(
            //   `Failed to delete temp file: ${file.path}`,
            //   unlinkErr
            // );
          } else {
            // console.log(`Deleted temp file: ${file.path}`);
          }
        });
      }
    });

    return res
      .status(500)
      .json({ status: "failed", message: error.message, data: "" });
  }
};

const Login = async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile) {
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Please fill the mobile",
          data: "",
        });
    }
    if (!password) {
      return res
        .status(400)
        .json({
          status: "failed",
          message: "Please fill the password",
          data: "",
        });
    }

    const user = await SCPPartner.findOne({ mobile });

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "Invalid mobile", data: "" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(404)
        .json({ status: "failed", message: "Invalid password", data: "" });
    }

    const token = generateToken(user);

    res.cookie("twc_uid2", token, {
      secure: true,
      httpOnly: true,
      domain: "technology-world-creater-assignment2.vercel.app",
    });

    res
      .status(200)
      .json({ status: "success", message: "login successfull", data: user });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "failed",
        message: "Unabled to login , please try again",
        data: "",
      });
  }
};

const Logout = (req, res) => {
  try {
    res.clearCookie("twc_uid2");

    return res
      .status(200)
      .json({ status: "success", data: "", message: "logout successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "faild",
        data: "",
        message: "Unabled to logout , please try again",
      });
  }
};

export { SendOtp, VerifyOTP, Register, Login, Logout };
