import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import user from '../models/user.model.js'
import uploadonclouidnary from '../utils/clouidnary.js'
import ApiResponse from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from 'mongoose-paginate-v2'

const generateAccessAndRefreshToken = async (userid) => {
  try {
    const userinstance = await user.findById(userid);

    // ❗ Fix: await missing before async functions
    const accesstoken = await userinstance.generateToken();
    const refreshtoken = await userinstance.generateRefreshToken();

    userinstance.refreshtoken = refreshtoken;
    await userinstance.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
  }
};



const registeruser = asynchandler( async(req,res)=> {
  // get users details from frontend
  // get validation "not empty"
   // check user is exist or not : username,email
   // check files and images ,check for avatar
   // upload them to clouidnary,avatar
   // create a user object-create in db
   // remove password and refreshtoken from field
   // check response is created or not if it is then return the user

   const{fullname,email,username,password}=req.body;

   if([fullname,email,username,password].some((field)=>field?.trim()==="")){
      throw new ApiError(400,"ALL FIELDS ARE MANDATORY")
   }

   const userexist=await user.findOne({$or:[{email},{username}]});

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

const userinstance = await user.create({
  fullname,
  avatar: avatar.url,
  coverimage: coverimage?.url || "",
  email,
  password,
  username: username.toLowerCase(),
});

     const usercreated = await user.findById(userinstance._id).select({ password: 0, refreshtoken: 0 });

     if(!usercreated){
      throw new ApiError(500,"something went wrong while register the user")
     }

      return res.status(200).json(
         new ApiResponse(200,usercreated,"user registered successfully")
      )



})


const loginuser = asynchandler( async(req,res)=> {
   //   req body -> data
   // check username or email 
   // all fields are reuired username or email
   // find the user in database
   // password check
   // access and refresh token generate
   // send secure cookies token
   // return res

   const{username,email,password}= req.body;
   console.log(username ,email,password)

   if([username,email,password].some((fields)=>fields?.trim()==="")){
       throw new ApiError(400,"username or email is mandatory")
   }

  //  const userexist=await user.findOne({ $or:[{username},{email},{password}]})
  const userexist = await user.findOne({
  $or: [{ username }, { email },{password}]
});

   if(!userexist){
     throw new ApiError(400,"User is not exist in our database")
   }

   const ispasswordvalid=await userexist.ispassword(password)
   
   if(!ispasswordvalid){
      throw new ApiError(400,"Invalid credentials")
   }

    const {accesstoken,refreshtoken}=await generateAccessAndRefreshToken(userexist._id)

    const loggedinuser=await user.findById(userexist._id).select({password:0,refreshtoken:0})

    const option={
        httponly:true,
        secure:true,
    }

    return res.status(200).cookie("accesstoken",accesstoken,option).cookie("refreshtoken",refreshtoken,option).json(new ApiResponse(200,{user:loggedinuser,accesstoken,refreshtoken},"user logged in successfully"))
})

const logoutuser = asynchandler(async (req, res) => {
    await user.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshtoken: undefined
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accesstoken", options)
        .clearCookie("refreshtoken", options)
        .json(new ApiResponse(200, {}, "user logout"));
});

const refreshaccesstoken = asynchandler( async(req,res) =>{
     const incomingrefreshtoken = req.cookies.refreshtoken || req.body.refreshtoken
     if(!incomingrefreshtoken){
      throw new ApiError(400,"Something went wrong for taking a incoming token ")
     }

   try {
     const decoded_refreshtoken=jwt.verify(incomingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
 
     const user=await user.findById(decoded_refreshtoken?._id)
     if(!user){
       throw new ApiError(400,"user is not defined")
      }
 
      if(incomingrefreshtoken != user?.refreshaccesstoken ){
       throw new ApiError(400,"Refresh code is expired")
      }
 
      const options ={
         httpOnly:true,
         secure:true,
       } 
 
       const{accesstoken,newrefreshtoken}=generateAccessAndRefreshToken(user._id)
 
       return res.status(200).cookie("accesstoken",accesstoken).cookie("refreshtoken",newrefreshtoken).json(
         new ApiResponse(200,{accesstoken,newrefreshtoken},"Access token refreshed")
       )
   } catch (error) {
      throw new ApiError(500,error?.message || "invalid refresh token")
   }

   } )

  const changecurrentpassword =asynchandler( async(req,res) =>{
      //  required fields  like oldpassword or confirmpassword
      //  check this fields is in our model or not if not then give me a error
      //  set a new password
      // const {oldpassword,newpassword,confirmpassword}=req.body;

      const{oldpassword,newpassword}=req.body;

      // if((newpassword===confirmpassword)){
      //   throw new ApiError(400,"please enter both the password should be same")
      // }
      const user =await user.findById(req.user?._id)
      const isposswordcorrect=user.ispassword(oldpassword);

      if(!isposswordcorrect){
          throw new ApiError(400,"old password is incorrect")
      }
      
      user.password=newpassword
      await user.save({validateBeforeSave:false})

      return res.status(200).json(new ApiResponse(200,"Password changes successfully",{}))
  } )

  const getcurrentuser = asynchandler( async(req,res)=>{
      const user=req.user;
      return res.status(200).json(200,user,"current user fetch successfully")
  })

  const updateaccountdetails = asynchandler( async(req,res)=>{
      const {fullname,email,username }=req.body;
       
      if((!fullname || !email || !username)){
        throw new ApiError(400,"Plsz fill the details first")
      }

       const userinstance=await user.findByIdAndUpdate(
        req.user?._id,
        {$set:{fullname,email:email,username:username}},
        {new:true}).select({password:0,refreshtoken:0} 
        )

        return res.status(200).json(
          new ApiResponse(200,userinstance,"Account details updated")
        )
  })

// use two middleware firstly multer and authmiddleware 
  const avatarupdated =asynchandler( async (req,res)=>{
    
    const avatarlocalpath=req.file?.path;
    if(!avatarlocalpath){
      throw new ApiError(400,"avater path is missing")
    }

    const avatar=uploadonclouidnary(avatarlocalpath)
    if(!avatar.url){
      throw new ApiError(400,"avater  is missing")
    }

    const userinstance=await user.findByIdAndUpdate(req.user?._id,{ $set:{avatar:avatar.url}},{new:true}).select({password:0,refreshtoken:0})

    return res.status(200).json(
      new ApiResponse(200).json(
          200,userinstance,"Avatar is updated"
      )
    )
  })

// two middleware use multer and authmiddleware
  const coverimageupdate = asynchandler ( async(req,res) =>{
       const coverimagelocalpath=req.file?.path
       if(!coverimagelocalpath){
        throw new ApiError(400,"Coverimage path is missing")
       }

       const coverimage=uploadonclouidnary(coverimagelocalpath)
       if(!coverimage){
        throw new ApiError(400,"coverimage is missing")
       }

       const userinstance=await user.findByIdAndUpdate(req.user?._id,{ $set:{coverimage} },{new:true}).select({password:0,refreshtoken:0})

        return res.status(200).json(
      new ApiResponse(200).json(
          200,userinstance,"Cover Image is updated"
      )
    )
  })

  const getuserchannelprofile =asynchandler( async(req,res)=>{
       const {username}= req.params;
       if(!username?.trim()){
        throw new ApiError(400,"Username is missing")
       }

      //  aggregrate pipeline
      const channel= await user.aggregate([
        {
          $match:{username:username?.toLowerCase()}
        },
        {
          $lookup:{
             from:"substricptions",
             localField:"_id",
             foreignField:"channel",
             as:"Subscriber"
          }
        },
         {
          $lookup:{
             from:"substricptions",
             localField:"_id",
             foreignField:"subscriber",
             as:"SubscribeTo"
          }
        },
        {
          $addFields:{
            subscriberscount:{ $size:"$subscriber"},
            channelsubscribedtocount:{ $size:"$subscribeto"},
            issubscribed:{
                 $cond:{
                   $if:{$in:[req.user?._id,"$subscriber.subscriber"]},
                   then:true,
                   else:false
                 }
            }
          }
        },
        {
            $project:{
              fullname:1,
              username:1,
              subscriberscount:1,
              channelsubscribedtocount:1,
              avatar:1,
              coverimage:1,
              email:1
            }
        }
       ])

       if(!channel?.length){
        throw new ApiError(400,"channel does not exist")
       }

       return res.status(200).json(
        new ApiResponse(200,channel[0],"user channel fetch successfully")
       )

  })

  const getwatchhistory= asynchandler( async(req,res) =>{
     const userinstance =await user.aggregate([
        {
          $match:{_id:new mongoose.Types.ObjectId(req.user._id)}
        },
        {
          $lookup:{
            from:"videos",
            localField:"watchhistory",
            foreignField:"_id",
            as:"watchhistory",
            pipeline:[
              {
                $lookup:{
                  from:"users",
                  localField:"owner",
                  foreignField:"_id",
                  as:"owner",
                  pipeline:[
                    {
                      $project:{
                        fullname:1,
                        username:1,
                        avatar:1,
                      }
                    }
                  ]
                }
              },
              {
                $addFields:{
                  owner:{
                    $first:"owner"
                  }
                }
              }
            ]
          }
        },




     ])

     return res.status(200).json(
      new ApiResponse(200,userinstance[0].watchhistory,"watch history fectched successfully")
     )
  })



export{registeruser,loginuser,logoutuser,refreshaccesstoken,getcurrentuser,changecurrentpassword,updateaccountdetails,avatarupdated,coverimageupdate,getuserchannelprofile,getwatchhistory}
