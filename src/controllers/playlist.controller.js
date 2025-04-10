import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videoIdes } = req.body;

  const playlist = await PlayList.create({
    name,
    description,
    videos: videoIdes,
    owner: req.user._id,
  });

  if (!playlist) {
    throw new ApiError(
      400,
      "there is something error while creating the playlist.."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "PlayList created sucessfully...", playlist));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const playLists = await PlayList.find({ owner: userId });
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "The User_id is Invalid...");
  }

  if (!playLists) {
    throw new ApiError(
      400,
      "There is no playlists are there or something went wrong while fetching the data from the database"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "PlayLists fetched sucessfully...", playLists));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "The PlayList Id is invalid ");
  }

  const playList = await PlayList.findById(playlistId);

  if (!playList) {
    throw new ApiError(
      400,
      "There is something error while fetching the playlist from the database.."
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist fetched sucessfully...", playList));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "The PlayList id is Invalid ");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  const updatedPlayList = await PlayList.findByIdAndUpdate(
    playlistId,
    { $addToSet:{videos:videoId} },
    { new: true }
  );
  console.log("Updated Playlist is =>", updatedPlayList);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "The Video is added Successfully in the playlist ",
        updatedPlayList
      )
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "The PlayList id is Invalid ");
  }

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "The Video Id is Invalid ");
  }

  const removeVideo = await PlayList.findByIdAndUpdate(
    playlistId,
    { $pull: { videos: videoId } },
    { new: true }
  );

  if (!removeVideo) {
    throw new ApiError(
      500,
      "There is something error while removing the video form the playlist"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Video removed from the playlist ", removeVideo)
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "The PlayList id is Invalid ");
  }

  const playlistDelete = await PlayList.findByIdAndDelete(playlistId);

  if (!playlistDelete) {
    throw new ApiError(500, "there is some error while deleting the playlist");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "PlayList deleted successfully.."));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "The PlayList id is Invalid ");
  }

  if (!name || !description) {
    throw new ApiError(400, "All fields are required ");
  }

  const playlistUpdate = await PlayList.findByIdAndUpdate(playlistId, [
    {
      $set: {
        name,
        description,
      },
    },
    
  ],{ new: true });

  if (!playlistUpdate) {
    throw new ApiError(
      500,
      "There is something error while updating the playlist details"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Playlist details updated successfully",
        playlistUpdate
      )
    );
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
