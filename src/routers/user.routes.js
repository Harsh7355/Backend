import express from 'express'
const router =express.Router();
import {registeruser,loginuser} from '../controllers/user.controller.js'
import {upload} from "../middlewares/multer.middleware.js"

router.route('/register').post(  
    upload.fields([
        {name:"avatar",maxCount:1},{ name:"coverimage",maxCount:1}
    ]),
     registeruser);
router.route('/register').post(loginuser);


export default router;

