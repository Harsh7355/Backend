import express from 'express'
import Razorpay from 'razorpay'
import createrorder from '../controllers/createorder.controller.js'
import verifypayment from '../middlewares/verifypayment.middleware.js'

const router=express.Router()

router.route('/createpayment').post(createrorder)
router.post("/verify-payment", verifypayment, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Payment verified successfully!",
  });
});

export default router;