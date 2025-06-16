import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import Comment from '../models/comment.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import _ from 'mongoose-paginate-v2'
import mongoose from 'mongoose'


const getVideosComment =asynchandler(async (req,res)=>{
    const { videoid }=req.params
    const { page=1 , limit=10 }=req.query;

    if(!videoid){
        throw new ApiError("get video comment is missing")
    }

    const result = await Comment.aggregatePaginate(Comment.aggregate([

      {
        $match:{
            video:new mongoose.Types.ObjectId(videoid),
        }
      },
      {
        $sort:{createdAt:-1},
      },
      {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"ownerinfo"
        }
      },
      {
        $unwind:"$ownerinfo"
      },
      {
            $project: {
                    content: 1,
                    createdAt: 1,
                     video:1,
                    "ownerinfo.username": 1,
                    "ownerinfo.email": 1
                }
      }

    ]),{page:parseInt(page),limit:parseInt(limit)})

        return res.status(200).json(
        new ApiResponse(200, result, "Comments fetched successfully.")
    );
})
const addComment =asynchandler(async (req,res)=>{
    const {videoid} =req.params
    const {content}=req.body;
 
    if(!content  || !videoid){
        throw new ApiError(400,"Both Id and content is missing")
    } 

    const commentInstance = await Comment.create({
        content,
        video: videoid,
        owner: req.user._id  // user who is commenting
    });

    return res.status(200).json(new ApiResponse(200,commentInstance,"Comment is deliverd"))

})
const deleteComment =asynchandler(async (req,res)=>{
     const {commentid}=req.params;
     if(!commentid){
        throw new ApiError(400,"commentid is missing")
     }

     const result=await Comment.findByIdAndDelete(commentid);

     if (!result) {
    throw new ApiError(404, "comment is not found not found");
     }

     return res
        .status(200)
        .json(new ApiResponse(200, result, "Comment deleted successfully."));
})
const updateComment =asynchandler(async (req,res)=>{
    const {content}=req.body;
    const {commentid}=req.params;

    if(!content || !commentid){
          throw new ApiError(400,"Both Id and content is missing")
    }

    const result=await Comment.findOneAndUpdate(
        { _id:commentid },
        {
            $set:{
                content:content
            }
        },
        {new:true},
    
    )
    if(!result){
        throw new ApiError(400,"Update comment issue")
    }

    return res.status(200).json(new ApiResponse(200,result,"update comment"))
})


export {getVideosComment,addComment,deleteComment,updateComment}