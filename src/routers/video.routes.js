import express from 'express'
import jwtverify from '../middlewares/auth.middleware.js';
import { getallVideos,publishavideos,getallVideosById,updatevideos,getPublishedVideos,thumbnailupdate,deletevideo,togglepublishstatus} from '../controllers/video.controller.js'
import { upload } from '../middlewares/multer.middleware.js';


const router=express.Router();

router.route('/').get(getallVideos)
router.route('/uniquevideo').get(jwtverify,getallVideosById)
router.route('/published').post( jwtverify,upload.fields([
       { name: "video" , maxCount:1 },
       { name:"thumbnail", maxCount:1}
]) , publishavideos )
router.get("/getpublishedvideos", getPublishedVideos);
router.route('/updatevideo').patch(jwtverify,upload.single("video"),updatevideos )
router.route('/updatethumbnailvideo').patch(jwtverify,upload.single("thumbnail"),thumbnailupdate )
router.route('/deletevideos').delete(jwtverify,deletevideo)
router.route('/togglestatus').patch(jwtverify,togglepublishstatus )

export default router;