import express from 'express'
const router =express.Router();
import {registeruser,loginuser,logoutuser,refreshaccesstoken} from '../controllers/user.controller.js'
import {upload} from "../middlewares/multer.middleware.js"
import jwtverify from '../middlewares/auth.middleware.js'

router.route('/register').post(  
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverimage", maxCount: 1 }
    ]),
    registeruser
);
router.route('/login').post(loginuser)

router.route('/logout').post(jwtverify,logoutuser)
router.route('/refreshtoekn').post(refreshaccesstoken)

export default router;

