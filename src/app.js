import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";

const app =express();

app.use (cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({extended:true}));
app.use(cookieparser());
app.use(express.static('public')); 


// Import Routes
import userRoute from "./routes/user.routes.js"
import tweetRoute from "./routes/tweet.routes.js"
import likeRoute from "./routes/like.routes.js"
import commentRoute from "./routes/comment.routes.js"
import videoRoute from "./routes/video.routes.js"
import playListRoute from "./routes/playlist.routes.js"
import subscribtionRoute from "./routes/subscription.routes.js"
import dashboardRoute from "./routes/dashboard.routes.js"

// Routes declaration 
app.use('/api/v1/users',userRoute)
app.use('/api/v1/tweets',tweetRoute)
app.use('/api/v1/like',likeRoute)
app.use('/api/v1/comment',commentRoute)
app.use('/api/v1/video',videoRoute)
app.use('/api/v1/playlist',playListRoute)
app.use('/api/v1/subscribtion',subscribtionRoute)
app.use('/api/v1/dashboard',dashboardRoute)
export default app;
