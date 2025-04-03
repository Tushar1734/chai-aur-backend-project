import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required");
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
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(400, "UserId is required");
  }

  const tweets = await Tweet.find({ owner: userId });

  if (!tweets) {
    throw new ApiError(
      500,
      "There is something error while fetching the tweets from the database"
    );
  }
  const tweet_content = tweets.map((tweet) => tweet.content);
  console.log("tweets =>", tweet_content);

  return res
    .status(200)
    .json(new ApiResponse(200, "tweets fetched successfully", tweet_content));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  if (!tweetId) {
    throw new ApiError(400, "TweetId is required");
  }
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.findByIdAndUpdate(
    tweetId,
    { content },
    { new: true }
  );

  if (!tweet) {
    throw new ApiError(
      500,
      "There is something error while updating the tweet "
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Updated Succcessfylly", tweet));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!tweetId) {
    throw new ApiError(400, "TweetId is required");
  }

  const tweet = await Tweet.findByIdAndDelete(tweetId);
  if (!tweet) {
    throw new ApiError(
      500,
      "There is something error while deleting the tweet "
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Tweet Deleted Successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
