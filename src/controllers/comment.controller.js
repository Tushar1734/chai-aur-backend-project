import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
 
  const { videoId } = req.params;

  if(!isValidObjectId(videoId)){
    throw new ApiError(400,"Invalid video id ");
  }

  const { page = 1, limit = 10 } = req.query;

  let pageNum = parseInt(page);
  let limitNum = parseInt(limit);
  const comments = await Comment
  .find({ video: videoId })
  .limit(limitNum)
  .skip((pageNum-1)*limitNum);
  console.log("comments =>",comments);

  if(!comments){
    throw new ApiError(500,"There is something error while fetching the comments of the video...");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,"Comments fetched sucessfully",comments)
  );
});

const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const { videoId } = req.params;

  if (!content) {
    throw new ApiError(400, "Content is required for making the comment");
  }

  const comment = await Comment.create({
    owner: req.user._id,
    content,
    video: videoId,
  });

  if (!comment) {
    throw new ApiError(
      500,
      "there is something wrong while creating the comment"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "comment added sucessfully...", comment));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Content is required for updating the comment...");
  }

  const comment_update = await Comment.findByIdAndUpdate(commentId, {
    content,
  });

  if (!comment_update) {
    throw new ApiError(
      500,
      "there is something error while updating the comment.."
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Comment updated sucessfully..", comment_update)
    );
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment_delete = await Comment.findByIdAndDelete(commentId);

  if (!comment_delete) {
    throw new ApiError(
      500,
      "There is something error while deleting the comment "
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Comment deleted sucessfully.."));
});

export { getVideoComments, addComment, updateComment, deleteComment };
