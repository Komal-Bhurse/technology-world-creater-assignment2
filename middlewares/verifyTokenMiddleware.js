import  { validateToken }  from "../services/auth.js";

const  verifyToken = async(req, res, next) =>{
  const userUid = req.cookies?.twc_uid2;
  if (!userUid) {
    return res.status(404).json({
      status:'failed',
      message: "Access Denied ! ",
      data:""
    });
  }
  const user = validateToken(userUid);
  if (!user) {
    return res.status(404).json({
      status:"failed",
      message: "Access Denied !",
      data:""
    });
  }
  
  req.user = user;
  next();
}
export default verifyToken
  
