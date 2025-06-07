import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import user from '../models/user.model.js'
import uploadonclouidnary from '../utils/clouidnary.js'
import ApiResponse from '../utils/ApiResponse.js'

const registeruser = asynchandler( async(req,res)=> {
  // get users details from frontend
  // get validation "not empty"
   // check user is exist or not : username,email
   // check files and images ,check for avatar
   // upload them to clouidnary,avatar
   // create a user object-create in db
   // remove password and refreshtoken from field
   // check response is created or not if it is then return the user

   const{fullName,email,username,password}=req.body;
   console.log(email);

   if([fullName,email,username,password].some((field)=>field?.trim()==="")){
      throw new ApiError(400,"ALL FIELDS ARE MANDATORY")
   }

   const userexist=await user.findOne({$or:[email,username]});

   if(userexist){
      throw new ApiError(400,"user with email or username is already exist")
   }
   
    const avatarfieldpath=req.files?.avatar[0]?.path;  
    const coverfieldpath=req.files?.coverimage[0]?.path; 

    if(!avatarfieldpath){
      throw new ApiError(400,"Avatar file is not uploaded")
    }

    const avatar=await uploadonclouidnary(avatarfieldpath);
    const coverimage=await uploadonclouidnary(coverfieldpath);

    if(!avatar){
      throw new ApiError(400,"Avatar file is not uploaded")
    }

    const user=await user.create({
          fullName,
          avatar:avatar.url,
          coverimage:coverimage?.url || "",
          email,
          password,
          username:username.tolowercase(),
       })

     const usercreated=await user.findById(user._id).select({password:0},{refreshtoken:0})
      
     if(!usercreated){
      throw new ApiError(500,"something went wrong while register the user")
     }

      return res.status(200).json(
         new ApiResponse(200,usercreated,"user registered successfully")
      )

})

const loginuser = asynchandler( async(req,res)=> {
   res.status(200).json({msg:"ok"})
})


export{registeruser,loginuser}