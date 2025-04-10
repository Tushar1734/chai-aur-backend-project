import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  let filters = {};

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    filters.owner = userId; 
  }

  let sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortType === "desc" ? -1 : 1;
  }

  const fetchedVideos = await Video.find(filters)
    .sort(sortOptions)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  return res
    .status(200)
    .json(new ApiResponse(200, "Videos fetched successfully", fetchedVideos));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  let videoPath = req.files.videoFile[0]?.path;
  let thumbnailPath = req.files.thumbnail[0]?.path;

  if (!videoPath) {
    throw new ApiError(400, "Video is required to upload a video ");
  }
  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file is required...");
  }

  const uploadedVideo = await uploadOnCloudinary(videoPath);
  const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath);

  console.log("cloudinary response after uploading a video =>", uploadedVideo);
  console.log("duration is ", uploadedVideo.duration);
  if (!uploadedVideo) {
    throw new ApiError(
      500,
      "There is something error while uploading the video "
    );
  }

  if (!uploadedThumbnail) {
    throw new ApiError(
      500,
      "There is something error while uploading the thumbnai "
    );
  }

  const video = await Video.create({
    videoFile: uploadedVideo.url,
    thumbnail: uploadedThumbnail.url,
    title,
    description,
    duration: uploadedVideo.duration,
    owner: req.user._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "video published success fully", video));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  let video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(
      400,
      "There is something error while fetching the video from the backend "
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "the video is fetched sucessfully", video));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  const thumbnail = req.file?.path;

  if (!title || !description || !thumbnail) {
    throw new ApiError(400, "All fields are required...");
  }
  const updateVideoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        thumbnail: thumbnail.url,
      },
    },
    {
      new: true,
    }
  );

  if (!updateVideoDetails) {
    throw new ApiError(
      500,
      "there is something error while updating the videodetails "
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Video details updated successfully...",
        updateVideoDetails
      )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  const deleteVideo = await Video.findByIdAndDelete(videoId);

  if (!deleteVideo)
    throw new ApiError(
      500,
      "there is some error is occured while deleting the video"
    );

  return res
    .status(200)
    .json(new ApiResponse(200, "Video deleted successfully..."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  const toggleIspublished = await Video.findByIdAndUpdate(
    videoId,
    [{ $set: { isPublished: { $not: "$isPublished" } } }],
    { new: true }
  );

  if (!toggleIspublished) {
    throw new ApiError(
      500,
      "there is something error while updating the video "
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Video publish status updated successfully...",
        toggleIspublished
      )
    );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
