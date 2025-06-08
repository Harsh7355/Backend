import ApiErrors from "../utils/ApiErrors.js";
import asynchandler from "../utils/asynchandler.js";
import jwt from 'jsonwebtoken'
import user from '../models/user.model.js'

const jwtverify = asynchandler( async (req,res,next)=>{
  try {
     const token=req.cookies?.accesstoken || req.headers("Authorization")?.replace("Bearer ","")
  
     if(!token){
      throw new ApiErrors(401,"Unauthorized access")
     }
  
     const decoded_token=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
     const user=await user.findById(decoded_token?.userid).select({password:0},{refreshtoken:0})
     
     if(!user){
      // todos discuss about frontend
      throw new ApiErrors(401,"Invalid access")
     }
  
      req.user=user;
      next();
  } catch (error) {
      throw new ApiErrors(401,error?.message || "something went wrong")
  }

})

export default jwtverify