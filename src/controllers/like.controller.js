import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const isLiked = await Like.findOne({ likedBy: req.user._id, video: videoId });

  if (!isLiked) {
    const result = await Like.create({ likedBy: req.user._id, video: videoId });
    if (!result) {
      throw new ApiError(400, "Something went wrong while Like the video ");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "video liked sucessfully..", result));
  } else {
    const result = await Like.findByIdAndDelete(isLiked._id);

    if (!result) {
      throw new ApiError(
        400,
        "there is something went wrong while unlike the video"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "video unliked sucessfully.."));
  }

  //TODO: toggle like on video
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const isLiked = await Like.findOne({
    likedBy: req.user._id,
    comment: commentId,
  });

  if (!isLiked) {
    const result = await Like.create({
      likedBy: req.user._id,
      comment: commentId,
    });
    if (!result) {
      throw new ApiError(400, "Something went wrong while Like the comment ");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "comment liked sucessfully..", result));
  } else {
    const result = await Like.findByIdAndDelete(isLiked._id);

    if (!result) {
      throw new ApiError(
        400,
        "there is something went wrong while unlike the comment"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "comment unliked sucessfully.."));
  }
  //TODO: toggle like on comment
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  const isLiked = await Like.findOne({ likedBy: req.user._id, tweet: tweetId });

  if (!isLiked) {
    const result = await Like.create({ likedBy: req.user._id, tweet: tweetId });
     console.log("video =>",result.video)
    if (!result) {
      throw new ApiError(400, "Something went wrong while Like the tweet ");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "tweet liked sucessfully..", result));
  } else {
    const result = await Like.findByIdAndDelete(isLiked._id);

    if (!result) {
      throw new ApiError(
        400,
        "there is something went wrong while unlike the tweet"
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "tweet unliked sucessfully.."));
  }

  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.find({video:{$ne:undefined},likedBy:req.user._id})
 
    if(!likedVideos){
        throw new ApiError(400,"there is no videos are there which are liked by you ")
    }

  return res
  .status(200)
  .json(new ApiResponse(200,"success like tweet",likedVideos));

  //TODO: get all liked videos
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
