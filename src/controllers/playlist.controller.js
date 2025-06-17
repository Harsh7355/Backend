import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import Playlist from '../models/playlist.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import _ from 'mongoose-paginate-v2' 
import mongoose from 'mongoose'
 
 const createPlaylist =asynchandler ( async(req,res)=>{
    // we need name and description of the playlist
    // check the validation 
    //  after that we directly create a playlist

    const{name,description,videos}=req.body;
    if(!name || !description){
        throw new ApiError(400,"name and desciption to create a playlist is mandatory")
    }

    const playlistinstance=await Playlist.create({
        name,
        description,
        videos,
        owner:req.user?._id
    })

    if(!playlistinstance){
        throw new ApiError(400,"Playlist is not created")
    }

    return res.status(201).json(
    new ApiResponse(201, playlistinstance, "Playlist created successfully")
  );

 })
 
 
 const getPlaylistById = asynchandler(async (req, res) => {
  const { playlistid } = req.params;

  if (!playlistid) {
    throw new ApiError(400, "Playlist ID is not mentioned in URL");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistid)) {
    throw new ApiError(400, "Invalid playlist ID format");
  }

  const playlistinstance = await Playlist.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistid),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videodetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerdetails",
      },
    },
    {
      $unwind: "$ownerdetails",
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        "ownerdetails.name": 1,
        "ownerdetails.email": 1,
        videodetails: {
          $map: {
            input: "$videodetails", // ✅ FIXED HERE
            as: "video",
            in: {
              _id: "$$video._id",
              title: "$$video.title",
              video: "$$video.video",
              thumbnail: "$$video.thumbnail",
              views: "$$video.views",
              duration: "$$video.duration",
              createdAt: "$$video.createdAt",
            },
          },
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlistinstance, "Playlist details"));
});

const updatePlaylist = asynchandler(async (req, res) => {
  const { playlistid } = req.params;
  const { name, description, videos } = req.body;

  // Check for missing or empty name/description
  if ([name, description].some(field => !field || field.trim() === "")) {
    throw new ApiError(400, "Name and description are required");
  }

  if (!mongoose.Types.ObjectId.isValid(playlistid)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlistid, 
    {
      $set: {
        name,
        description,
        videos,
      },
    },
    { new: true }
  );

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  return res.status(200).json(
    new ApiResponse(200, updatedPlaylist, "Playlist updated successfully")
  );
});

const deletePlaylist = asynchandler(async (req, res) => {
  const { playlistid } = req.params;

  // Validate playlistid
  if (!playlistid) {
    throw new ApiError(400, "Playlist ID is required");
  }

  // Check if playlist exists
  const existingPlaylist = await Playlist.findById(playlistid);
  if (!existingPlaylist) {
    throw new ApiError(404, "Playlist not found");
  }

  // Optional: Check ownership (if only owner can delete)
  // if (existingPlaylist.owner.toString() !== req.user._id.toString()) {
  //   throw new ApiError(403, "You are not authorized to delete this playlist");
  // }

  // Delete the playlist
  await Playlist.findByIdAndDelete(playlistid);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Playlist deleted successfully"));
});

 
 const addVideoToPlaylist = asynchandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  // Validation
  if (!videoId || !playlistId) {
    throw new ApiError(400, "Both videoId and playlistId are required");
  }

   const playlist=await Playlist.findByIdAndUpdate({
    _id:playlistId
   },{
    $addToSet:{videos:videoId}
   },{
    new:true
   })


  return res.status(200).json(
    new ApiResponse(200, playlist, "Video added to playlist successfully")
  );
});


 
 const removeVideoFromPlaylist =asynchandler ( async(req,res)=>{
    const { videoId, playlistId } = req.params;

  if (!videoId || !playlistId) {
    throw new ApiError(400, "Both videoId and playlistId are required");
  }
  const playlist = await Playlist.findByIdAndUpdate(
    { _id: playlistId },
    { $pull: { videos: videoId } }, 
    { new: true }
  );


  return res.status(200).json(
    new ApiResponse(200, playlist, "Video added to playlist successfully")
  );
 })
 
 const getUserPlaylists = asynchandler(async (req, res) => {

    const { userid } = req.params;

  if (!userid) {
    throw new ApiError(400, "user ID is not mentioned in URL");
  }

  if (!mongoose.Types.ObjectId.isValid(userid)) {
    throw new ApiError(400, "Invalid user ID format");
  }

  const playlistinstance = await Playlist.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "videodetails",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerdetails",
      },
    },
    {
      $unwind: "$ownerdetails",
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdAt: 1,
        updatedAt: 1,
        "ownerdetails.name": 1,
        "ownerdetails.email": 1,
        videodetails: {
          $map: {
            input: "$videodetails", 
            as: "video",
            in: {
              _id: "$$video._id",
              title: "$$video.title",
              video: "$$video.video",
              thumbnail: "$$video.thumbnail",
              views: "$$video.views",
              duration: "$$video.duration",
              createdAt: "$$video.createdAt",
            },
          },
        },
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, playlistinstance, "Playlist details"));
});

 
 
 export {createPlaylist,getPlaylistById,updatePlaylist,deletePlaylist,addVideoToPlaylist,removeVideoFromPlaylist,getUserPlaylists}