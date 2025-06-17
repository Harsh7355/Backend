import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import like from '../models/like.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import _ from 'mongoose-paginate-v2'
import mongoose from 'mongoose'
import Like from '../models/like.model.js'

const getLikedVideos =asynchandler(async(req,res)=>{
 
     const Liked=await Like.aggregate([
        {
            $match:{
                likeby:new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup:{
                from:"comments",
                localField:"comment",
                foreignField:"_id",
                as:"commentinfo"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"likeby",
                foreignField:"_id",
                as:"userinfo"
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videoinfo",
            }
        },
        {
            $lookup:{
                from:"tweets",
                localField:"tweet",
                foreignField:"_id",
                as:"tweetinfo",
            }
        }, {
      $unwind: {
        path: "$userinfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: "$videoinfo",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
         $project: {
        _id: 1,
        likeby: "$userinfo.name",
        video: "$videoinfo.title",
        videoId: "$videoinfo._id",
        tweetinfo: 1,
        commentinfo: 1,
      },
    }
     ])

       return res.status(200).json(
    new ApiResponse(200, Liked, "Liked videos fetched successfully")
  );


})

const toggleCommentLike =asynchandler(async(req,res)=>{
        const {commentId} = req.params
        const {userid}=req.user?._id

        if(!commentId || !userid){
            throw new ApiError(400,"Both id is missing")
        }

        const existinglike=await Like.findOne({commentId,userid});

        if(existinglike){
            await Like.findByIdAndDelete(existinglike._id)
             return res.status(200).json(
               new ApiResponse(200, null, "Comment unliked successfully")
            );
        }else{
            const newcomment = await Like.create({
                  comment: commentId,
                   likeby: userid,
           });
               return res.status(200).json(
      new ApiResponse(200, newcomment, "Comment liked successfully")
               )
              
        }

})

const toggleVideoLike =asynchandler(async(req,res)=>{
      const {videoId} = req.params
     const {userid} =req.user?._id;
     if(!videoId || !userid){
        throw new ApiError(400,"Both the is is missing")
     }

     const existinglike=await Like.findOne({videoId,userid})

     if(existinglike){
        await Like.findByIdAndDelete(existinglike._id)
        return res.status(200).json(new ApiResponse(200,null,"Video Unliked successfully"))
     }else{
        const likevideo=await Like.create({
            video:videoId,
            likeby:userid,
        })

        return res.status(200).json(new ApiResponse(200,likevideo,"video liked successfully"))
     }
})

const toggleTweetLike =asynchandler(async(req,res)=>{
        const {tweetId} = req.params
        const {userid}=req.user?._id;

        if(!tweetId || !userid){
             throw new ApiError(400,"Both the is is missing")
        }

        const existingtweet=await Like.findOne({tweetId,userid})

        if(existingtweet){
            await Like.findByIdAndDelete(existingtweet._id);
            return res.status(200).json(new ApiResponse(200,null,"tweet unlike successfully"))
        }
        else{
            const tweetlike=await Like.create({
                tweet:tweetId,
                 likeby:userid,
            })

        return res.status(200).json(new ApiResponse(200,tweetlike,"tweet liked successfully"))
        }

})



export {
    getLikedVideos,
    toggleCommentLike,
    toggleVideoLike,
    toggleTweetLike,
}