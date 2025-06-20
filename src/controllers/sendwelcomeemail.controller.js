import sendEmail from "../utils/sendEmail.js";
import asynchandler from "../utils/asynchandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import sendwelcomemails from '../routers/email.router.js'

const sendwelcomemail =asynchandler( async(req,res)=>{
 
    const {email,name}=req.body;

    const html = `<h2>Hello ${name}</h2><p>Welcome to our app`;

    await sendEmail(email,"Welcome to my app",html)

     res.status(200).json({
    success: true,
    message: "Email sent successfully",
  });
});


export default sendwelcomemail;