import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import Twitter from '../models/twitter.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import _ from 'mongoose-paginate-v2'
import mongoose from 'mongoose'

const createtweet =asynchandler( async(req,res)=>{
    const {content} =req.body;

    if(!content || typeof content !== "string"  || content.trim()===""){
        throw new ApiError(400,"Content is mandatory")
    }

    const twitterinstance= await Twitter.create({
        content,
        owners:req.user?._id
    })

      return res
    .status(201)
    .json(new ApiResponse(201, twitterinstance, "Tweet created successfully"));
});


const getuserstweets = asynchandler(async (req, res) => {
   const twitterinstance =await Twitter.findOne({owners:req.user?._id})

   if(!twitterinstance){
    throw new ApiError(400,"twitter post is right now not updated")
   }

   return res.status(200).json(new ApiResponse(200,twitterinstance,"post is updated"))
});

const updatetweets = asynchandler(async (req, res) => {
  const { content } = req.body;
  const { tweetid } = req.params;

  if (!content || typeof content !== "string" || content.trim() === "") {
    throw new ApiError(400, "Updated content is required and must be a non-empty string");
  }

  const updatedTweet = await Twitter.findOneAndUpdate(
    { _id: tweetid, owners: req.user?._id },
    {
      $set: {
        content: content,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new ApiError(404, "Tweet not found or you're not authorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet updated successfully", updatedTweet));
});

const deletetweet = asynchandler(async (req, res) => {
  const { tweetid } = req.params;

  const deletedTweet = await Twitter.findByIdAndDelete(tweetid);

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet not found");
  }

  return res.status(200).json(new ApiResponse(200, "Tweet deleted successfully", deletedTweet));
});

export {createtweet,getuserstweets,updatetweets,deletetweet}