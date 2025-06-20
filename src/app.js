import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors"; 

const app = express();


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"], 
  credentials: true                         
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));               
app.use(cookieParser());


// routes import
import userroutes from './routers/user.routes.js'
import videoroutes from './routers/video.routes.js'
import twitterroutes from './routers/twitter.router.js'
import commentroutes from './routers/comment.router.js'
import subscriberroutes from './routers/subscriber.router.js'
import palylistroutes from './routers/playlist.router.js'
import likeroutes from './routers/like.router.js'
import paymentroutes from './routers/payment.router.js'
import emailroutes from './routers/email.router.js'

app.use('/api/user',userroutes)
app.use('/api/video',videoroutes)
app.use('/api/twitter',twitterroutes)
app.use('/api/comment',commentroutes)
app.use('/api/subscriber',subscriberroutes)
app.use('/api/playlist',palylistroutes)
app.use('/api/like',likeroutes)
app.use('/api/payment',paymentroutes)
app.use('/api/email',emailroutes);

export default app;
