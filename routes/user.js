import express from 'express'
import {getAllUsers,getOneUser,addOneUser,updateOneUser,deleteOneUser} from '../controllers/user.js'
import  verifyToken  from "../middlewares/verifyTokenMiddleware.js"
import  authorizedRole  from "../middlewares/roleMiddleware.js"

import multer from 'multer'
import path from "path"
import fs from 'fs'

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
  
  const uploadFarmerPhoto = multer({ storage });

const router = express.Router()

router.get('/getall', verifyToken ,authorizedRole("SCP"),getAllUsers)

router.get('/:id',verifyToken,authorizedRole("SCP"),getOneUser)

router.post('/',uploadFarmerPhoto.fields([{name:"farmerPhoto"}]),addOneUser)

router.put('/:id',uploadFarmerPhoto.fields([{name:"farmerPhoto"}]),updateOneUser)

router.delete('/:id',verifyToken,authorizedRole("SCP"),deleteOneUser)

export default router;


