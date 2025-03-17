import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError}   from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async(userId)=>{

        const user=await User.findById(userId);
        
        const AccessToken = user.generateAccessToken();
        const RefreshToken =user.generateRefreshToken();

        user.refreshToken = RefreshToken;
        user.save({validateBeforeSave:false});

        return {AccessToken,RefreshToken};
}

const registerUser = asyncHandler(async (req, res) => {
  
    
    //get user details from front end 
    //validate not empty 
    //check if user already exists :usernmae ,email
    //check for images,check for avatar
    //create user object - create db entry 
    //remove password and refresh token from the response
    //check for user creation 
    //return res

    const {fullname ,email,password,username} = req.body;

   // console.log("Req.Boy ==>",req.body);
    
    if([fullname,email,password,username].some((field)=> field?.trim() ==="")){
        throw new ApiError(400,"All fields are required...");
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"user with same username or email already exist ");

    }

 //   console.log("req.Files,",req.files);

    const avatarLocalpath = req.files?.avatar[0]?.path;
    // const coverImageLocalpath = req.files?.coverImage[0]?.path;

    let coverImageLocalpath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalpath = req.files.coverImage[0].path;
    }

    if(!avatarLocalpath){
        throw new ApiError(400, "avatar image is required ...");
    }

    const avatar = await uploadOnCloudinary(avatarLocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);

    if(!avatar){
        throw new ApiError (400,"avatar field is required ....");
    }

   const user= await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username: username.toLowerCase(),
        email,
        password

    })
    
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError (500,"something went wrong while creating the user");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"user Registered successfully ")
    );


});

const loginUser = asyncHandler(async(req,res)=>{

    const {username,email,password} = req.body;

    if(!(username || email)){
        throw new ApiError(400,"Username or email is required...");
    }

    const user = await User.findOne({
        $or: [{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"User does not exist...")
    }

   const isPasswordValid= await user.isPasswordCorrect(password);
   
   if (!isPasswordValid) {
        throw new ApiError(401,"Invalid User Credentials (incorrect password)")
   }
    
    const{AccessToken,RefreshToken}= await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",AccessToken,options)
    .cookie("refreshToken",RefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,AccessToken,RefreshToken
            },
            "User loggedIn successfully..."
        )
    )

});

const logOutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true,
    }
)

    const options={
        httpOnly:true,
        secure:true
    }

   return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse (200,{},"User Logged Out"))  
                
});

export { registerUser , loginUser,logOutUser };
