 //require ('dotenv').config({path:'./env'});
import app from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
dotenv.config({ path:'./.env'});


connectDB().then(() => {

    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
    app.on("error", (error) => {
        console.error("Express error:", error);
    });
}).catch((error) => {
    console.log("server Erorr", error);
});