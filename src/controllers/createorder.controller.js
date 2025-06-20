import Razorpay from "razorpay";
import ApiResponse from "../utils/ApiResponse.js";
import asynchandler from "../utils/asynchandler.js";
import ApiErrors from "../utils/ApiErrors.js";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../Public/temp/.env') });



// firstly configuration ready krna 
const instance=new Razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const order=asynchandler( async (req,res)=>{
    try {
        const {amount}= req.body;

        const options={
         amount:amount*100,
         currency:"INR",
         receipt:`receipt_${Date.now()}`,
        }

        const orderinstace= await instance.orders.create(options);

        res.status(200).json(new ApiResponse(200,orderinstace,"Order is successfully created"))

    } catch (error) {
        throw new ApiErrors(400,error.message)
    }
})

export default order;