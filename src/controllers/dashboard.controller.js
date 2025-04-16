import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

  const [videoStats, likeStats, totalSubscribers] = await Promise.all([
    Video.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(req.user._id),
        },
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          toatlViews: { $sum: "$views" },
        },
      },
    ]),

    Like.aggregate([
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "videoDetails",
        },
      },
      {$unwind:"$videoDetails"},
      {$match:{"videoDetails.owner":new mongoose.Types.ObjectId(req.user._id)}},
      {$count:"totalLikes"}
    ]),

      Subscription.countDocuments({channel:req.user._id})  


  ]);

  const stats = {
    totalVideos:videoStats[0]?.totalVideos,
    toatlViews:videoStats[0]?.toatlViews,
    Likes:likeStats[0]?.totalLikes || 0,
    totalSubscribers
  }

  

  return res
    .status(200)
    .json(new ApiResponse(200, "Your data is here ", stats));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  let userId = req.user._id;

  let videos = await Video.find({ owner: userId }).sort({ createdAt: -1 });
  if (!videos || videos.length == 0) {
    throw new ApiError(400, "No videos found for this channel ");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully...", videos));
});

export { getChannelStats, getChannelVideos };
