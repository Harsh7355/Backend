import express from 'express'
import jwtverify from '../middlewares/auth.middleware.js'
import {getSubscribedChannel,toggleSubscribedChannel,getUserChannelSubscribers} from '../controllers/subscribe.controller.js'
const router=express.Router();
router.use(jwtverify)


router.route('/c/:channelid').get(getSubscribedChannel)
router.route('/c/:channelid').post(toggleSubscribedChannel)
router.route("/u/:subscriberId").get(getUserChannelSubscribers);


export default router;