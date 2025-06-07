import express from 'express'
const router =express.Router();
import {registeruser,loginuser} from '../controllers/user.controller.js'

router.route('/register').post(registeruser);
router.route('/register').post(loginuser);


export default router;

