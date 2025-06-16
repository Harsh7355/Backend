import asynchandler from '../utils/asynchandler.js'
import ApiError from '../utils/ApiErrors.js'
import Subscription from '../models/subscription.model.js'
import ApiResponse from '../utils/ApiResponse.js'
import _ from 'mongoose-paginate-v2'
import mongoose from 'mongoose'

const getSubscribedChannel = asynchandler(async (req, res) => {
  const subscriberId = req.user?._id || req.params.subscriberId;

  if (!subscriberId) {
    throw new ApiError(400, "subscriberId is not provided");
  }

  const result = await Subscription.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriberId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelInfo"
      }
    },
    {
      $unwind: "$channelInfo"
    },
    {
      $project: {
        _id: 0,
        channelId: "$channelInfo._id",
        username: "$channelInfo.username",
        email: "$channelInfo.email"
      }
    }
  ]);

  return res.status(200).json(new ApiResponse(200, result, "Subscribed channels fetched."));
});

const toggleSubscribedChannel = asynchandler(async (req, res) => {
  const channelId = req.params.channelid;
  const userId = req.user._id;

  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: userId
  });

  const isSubscribed = !!subscription;

  const channelInfo = await User.findById(channelId).select("username email");

  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });
  const totalChannelsUserSubscribed = await Subscription.countDocuments({ subscriber: userId });

  return res.status(200).json(
    new ApiResponse(200, {
      isSubscribed,
      subscribercount: totalSubscribers,
      channelcount: totalChannelsUserSubscribed,
      channelInfo
    }, "Toggle subscription info fetched.")
  );
});

const getUserChannelSubscribers = asynchandler(async (req, res) => {
  const userId = req.user._id;

  const result = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "subscriber",
        foreignField: "_id",
        as: "subscriberInfo"
      }
    },
    {
      $unwind: "$subscriberInfo"
    },
    {
      $project: {
        _id: 0,
        subscriberId: "$subscriberInfo._id",
        username: "$subscriberInfo.username",
        email: "$subscriberInfo.email"
      }
    }
  ]);

  return res.status(200).json(new ApiResponse(200, result, "Channel subscribers fetched."));
});



export {getSubscribedChannel,toggleSubscribedChannel,getUserChannelSubscribers}