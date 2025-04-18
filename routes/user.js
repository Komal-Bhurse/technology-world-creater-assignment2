import express from 'express'
import {getAllUsers,getOneUser,addOneUser,updateOneUser,deleteOneUser} from '../controllers/user.js'
import  verifyToken  from "../middlewares/verifyTokenMiddleware.js"
import  authorizedRole  from "../middlewares/roleMiddleware.js"

const router = express.Router()

router.get('/getall', verifyToken ,authorizedRole("SCP"),getAllUsers)

router.get('/:id',verifyToken,authorizedRole("SCP"),getOneUser)

router.post('/',verifyToken,authorizedRole("SCP"),addOneUser)

router.put('/:id',verifyToken,authorizedRole("SCP"),updateOneUser)

router.delete('/:id',verifyToken,authorizedRole("SCP"),deleteOneUser)

export default router;


