import express from 'express'

import {SendOtp,VerifyOTP , Register,Login,Logout} from '../controllers/auth.js'

import  verifyToken from "../middlewares/verifyTokenMiddleware.js"

const router = express.Router()

router.post('/send-otp', SendOtp)

router.post('/verify-otp', VerifyOTP,Register)

router.post('/login', Login)

router.post('/logout',verifyToken, Logout)

export default router;
