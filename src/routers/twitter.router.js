import express from 'express'
import jwtverify from '../middlewares/auth.middleware.js';
import {createtweet,getuserstweets,updatetweets,deletetweet} from '../controllers/twitter.controller.js'
const router=express.Router();

router.route('/').post(jwtverify,createtweet)
router.route('/usertweets').get(jwtverify,getuserstweets)
router.route('/updatetweets/:id').patch(jwtverify,updatetweets)
router.route('/:tweetid').delete(deletetweet)

export default router;