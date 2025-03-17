import { Router } from "express";
import { loginUser, logOutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middlewate.js";

const router = Router();

router.route('/register').post(
    upload.fields([
       {
            name:"avatar",
            maxCount:1
       },
        {
            name:"coverImage",
            maxCount:1
        }
    ])
    
    ,registerUser);
    router.route('/login').post(loginUser);

    //SECURED ROUTE

    router.route('/logout').post(verifyJWT,logOutUser)
    router.route('refresh-Token').post(refreshAccessToken)

export default router;