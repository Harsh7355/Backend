import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import Video from '../models/video.model.js'
import uploadonclouidnary from '../utils/clouidnary.js'
import ApiResponse from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import _ from 'mongoose-paginate-v2'
import mongoose from 'mongoose'


const getallVideos = asynchandler( async (req,res)=>{

    const Videos=await Video.aggregate([
         {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerinfo",
            }
         },
         {
            $unwind:"$ownerinfo"
         },
         {
            $project:{
                title:1,
                description:1,
                thumbnail:1,
                video:1,
                createdAt:1,
                updatedAt:1,
                "ownerinfo.email":1,
                "ownerinfo.username":1,
            }

         },
         {
            $sort:{
                createdAt:-1
            }
         }
    ]);

    // console.log(Videos)


    if(!Videos.length){
      throw new ApiError(400,"Fetching issue in videos")
    }

    return res.status(200).json(new ApiResponse(200, Videos, "All published videos"));
})

const getPublishedVideos = asynchandler(async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerinfo",
      },
    },
    { $unwind: "$ownerinfo" },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        video: 1,
        createdAt: 1,
        "ownerinfo.username": 1,
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ]);

  if (!videos.length) {
    throw new ApiError(404, "No published videos found");
  }

  return res.status(200).json(
    new ApiResponse(200, videos, "All published videos fetched successfully")
  );
});


const publishavideos =asynchandler (async (req,res)=>{
    // we take title and description
    //  check the validations any one of the fields is empty or not then give error
    //  create a file path for video and thumbnail and check its filepath is exist or not
    //  after checking the path we can direclty the file upload on uploadonclouidnary
    // then we can check this file is uploaded or not in clouidnary
    //  if not then give an error
    //  if it is then we can create publishedvideos section

      const{title,description} =req.body;

    if ([title, description].some((field) => typeof field !== "string" || field.trim() === "")) {
    throw new ApiError(400, "Title and description must be non-empty strings");
    }


      const videopath=req.files?.video[0].path;
      const thumbnailpath=req.files?.thumbnail[0].path;

      if(!videopath && !thumbnailpath){
        throw new ApiError(400,"Both videopath and thumbnailpath is not exist")
      }

      const videos = await uploadonclouidnary(videopath)
      const thumbnails=await uploadonclouidnary(thumbnailpath)

      if(!videos && !thumbnails){
        throw new ApiError(400,"File is not uploaded in clouidnary")
      }

      const videoinstance =await Video.create({
           title,
           description,
           video: videos.url,
           thumbnail:thumbnails.url,
           owner:req.user._id,

      })

      const VideoCreated=await Video.findById(videoinstance._id);

      if(!VideoCreated){
        throw new ApiError(400,"Video instance is not created")
      }

      return res.status(200).json( new ApiResponse(200,"video is published",{VideoCreated}))

})

const getallVideosById = asynchandler(async (req, res) => {
  const Videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id)  // 🔥 Correct filter
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerinfo"
      }
    },
    {
      $unwind: "$ownerinfo"
    },
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        video: 1,
        createdAt: 1,
        updatedAt: 1,
        "ownerinfo.email": 1,
        "ownerinfo.username": 1
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ]);

  if (!Videos.length) {
    throw new ApiError(400, "No videos found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Videos, "All videos by current user"));
});

const updatevideos =asynchandler(async(req,res)=>{
   
    const updatepathvideo=req.file?.path;

    if(!updatepathvideo){
       throw new ApiError(400,"Updated video path is missing")
    }

    const updatevideoonclouidnary = await uploadonclouidnary(updatepathvideo)
    if(!updatevideoonclouidnary){
        throw new ApiError(400,"Updated video in uploadinary is incorrect")
    } 

   const videoinstance = await Video.findOneAndUpdate(
     { owner: req.user._id },
       {
        $set: {
         video: updatevideoonclouidnary.url,
       }
  },
  {
    new: true
  }
)
     return res.status(200).json(new ApiResponse(200,"video is updated",videoinstance))

})


const thumbnailupdate = asynchandler(async (req, res) => {
  const thumbnailupdatepath = req.file?.path;

  if (!thumbnailupdatepath) {
    throw new ApiError(400, "thumbnail update path is missing");
  }

  const updatedthumbnailoncloudinary = await uploadonclouidnary(thumbnailupdatepath);

  if (!updatedthumbnailoncloudinary) {
    throw new ApiError(400, "thumbnail upload to Cloudinary failed");
  }

  const thubmnailinstance = await Video.findOneAndUpdate(
    { owner: req.user?._id },
    {
      $set: {
        thumbnail: updatedthumbnailoncloudinary.url,
      }
    },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, "thumbnail is updated", thubmnailinstance));
});

const deletevideo = asynchandler(async (req, res) => {
  const deletedvideo = await Video.findOneAndDelete({ owner: req.user?._id });

  if (!deletedvideo) {
    throw new ApiError(404, "Video not found or not owned by user");
  }

  return res.status(200).json(
    new ApiResponse(200, "Video deleted successfully", {
      title: deletedvideo.title,
      description: deletedvideo.description,
      videoUrl: deletedvideo.video
    })
  );
});
const togglepublishstatus = asynchandler(async (req, res) => {
  const video = await Video.findOne({ owner: req.user._id });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Toggle publish status
  video.isPublished = !video.isPublished;

  // Save updated videos
  await video.save({validateBeforeSave:false});

  return res.status(200).json(
    new ApiResponse(200, "Video publish status updated", {
      isPublished: video.isPublished,
    })
  );
});


export {getallVideos,publishavideos,getallVideosById,getPublishedVideos ,updatevideos,thumbnailupdate,deletevideo,togglepublishstatus};


