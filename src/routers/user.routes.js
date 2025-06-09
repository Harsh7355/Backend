import express from 'express'
const router =express.Router();
import {registeruser,loginuser,logoutuser,refreshaccesstoken,changecurrentpassword,getcurrentuser,updateaccountdetails,avatarupdated,coverimageupdate,getuserchannelprofile,getwatchhistory} from '../controllers/user.controller.js'
import {upload} from "../middlewares/multer.middleware.js"
import jwtverify from '../middlewares/auth.middleware.js'
import multer from 'multer';

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
router.route('/changepassword').post(jwtverify,changecurrentpassword)
router.route('/curruser').post(jwtverify,getcurrentuser)
router.route('/updateaccountdetails').patch(jwtverify,updateaccountdetails)
router.route('/avatarupdated').patch(jwtverify,upload.single("avatar"),avatarupdated)
router.route('/coverimageupdate').post(jwtverify,upload.single("coverimage"),coverimageupdate)
// because params
router.route('/c/:username').get(jwtverify,getuserchannelprofile)
router.route('/history').get(jwtverify,getwatchhistory)

export default router;

