import express from 'express'
import path from "path"
import fs from 'fs'
import {SendOtp,VerifyOTP , Register,Login,Logout} from '../controllers/auth.js'

import  verifyToken from "../middlewares/verifyTokenMiddleware.js"
import multer from 'multer'

// configure multer  storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    const tempPath = path.resolve("./uploads/temp");
    fs.mkdirSync(tempPath, { recursive: true });
    return cb(null, tempPath);
      // return cb(null, path.resolve("./uploads"));
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      return cb(null, fileName);
    },
  });
  
  const uploadSCPPartner = multer({ storage });

const router = express.Router()

router.post('/send-otp', SendOtp)

router.post('/verify-otp',VerifyOTP, uploadSCPPartner.fields([{name:"scpCertificate"},{name:"officePhoto"}]),Register)

router.post('/login', Login)

router.post('/logout',verifyToken, Logout)

export default router;
