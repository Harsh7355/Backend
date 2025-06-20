import crypto from 'crypto'
import asynchandler from '../utils/asynchandler.js'
import ApiErrors from '../utils/ApiErrors.js'
import ApiResponse from '../utils/ApiResponse.js'


const verifypayment =asynchandler ( async(req,res)=>{
    try {
        const{ razorpay_order_id,razorpay_payment_id,razorpay_signature }=req.body;
        
        const sign = razorpay_order_id+ "|" + razorpay_payment_id;

        const expectedresult=crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(sign).digest("hex")

        if(expectedresult === razorpay_signature){
            next();
        }
    } catch (error) {
        throw new ApiErrors(400,false,"payment is failed")
    }
})

export default verifypayment;