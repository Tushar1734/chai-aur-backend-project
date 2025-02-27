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

// Routes declaration 
app.use('/api/v1/users',userRoute)

export default app;