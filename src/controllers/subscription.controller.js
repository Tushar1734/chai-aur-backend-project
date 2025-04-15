
import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
  if(  !isValidObjectId(channelId)){
    throw new ApiError(404,"Invalid Channel Id.....");
  }

    let isSubscribed = await Subscription.findOne({subscriber: req.user._id,channel:channelId});
    console.log("isSubscribed..",isSubscribed)
    if(isSubscribed){
        let unSubscribe = await Subscription.findByIdAndDelete(isSubscribed._id);
        if(!unSubscribe){
            throw new ApiError(500,"There is something error while unsubcribing the channel");
        }
        return res
        .status(200)
        .json(new ApiResponse(200,"Channel unsubscribed successfully...",unSubscribe));
    }
    else{
        let subscribe = await Subscription.create({subscriber:req.user._id,channel:channelId});

        if(!subscribe){
            throw new ApiError(500,"There is something error while subscribing the channel...");
        }

        return res
        .status(200)
        .json(new ApiResponse(200,"Channel Subscribed successfully...",subscribe));
    }
    
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Channel id is invalid please enter valid channel id ");
    }
    let subscribers = await Subscription.find({channel:subscriberId});

    if(!subscribers){
        throw new ApiError(500,"There is something error while fetching the subscriber of the channel ");

    }

    return res
    .status(200)
    .json( new ApiResponse(200,"Subscriber fetched successfully",subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    console.log(req.params)
    const subscriberId  = req.params.channelId
    
    
     if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Channel id is invalid please enter valid channel id ");
    }
    let channels = await Subscription.find({subscriber:subscriberId,channel:{$ne:undefined}});
    console.log("channels",channels)
    if(!channels){
        throw new ApiError(500,"There is something error while fetching the Subscribed channels  ");

    }

    return res
    .status(200)
    .json( new ApiResponse(200,"Subscribed Channels fetched successfully",channels))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
