import express from 'express'
import jwtverify from '../middlewares/auth.middleware.js'
import {getVideosComment,addComment,deleteComment,updateComment} from '../controllers/comment.controller.js'
const router=express.Router();

router.use(jwtverify)

router.route('/:videoid').get(getVideosComment)
router.route('/:videoid').post(addComment)
router.route('/c/:commentid').delete(deleteComment)
router.route('/c/:commentid').patch(updateComment)


export default router;