import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError("Content is required", 400);
  }

  
 
  const tweet = await Tweet.create({
    owner: req.user._id,
    content,
  });

  if (!tweet) {
    throw new ApiError(
      "There is something wrong while creating the tweet",
      500
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Created Successfully", tweet));
  //TODO: create tweet
});

const getUserTweets = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    if(!userId){
        throw new ApiError ("UserId is required",400);
    }
  // TODO: get user tweets
});

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {content} = req.body;
    if(!tweetId){
        throw new ApiError ("TweetId is required",400);
    }
    if(!content){
        throw new ApiError ("Content is required",400);
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        {content},
        {new:true}
    );

    if(!tweet){
        throw new ApiError ("There is something error while updating the tweet ",500);
    }

    return res
    .status(200)
    .json(new ApiResponse(200,"Tweet Updated Succcessfylly",tweet));
  //TODO: update tweet
});

const deleteTweet = asyncHandler(async (req, res) => {

    const {tweetId} = req.params;
    if(!tweetId){
        throw new ApiError ("TweetId is required",400);
    }

    const tweet = await Tweet.findByIdAndDelete(tweetId);
    if(!tweet){
        throw new ApiError ("There is something error while deleting the tweet ",500);
    }
    return res.
    status(200)
    .json(new ApiResponse(200,"Tweet Deleted Successfully",tweet));
  //TODO: delete tweet
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
