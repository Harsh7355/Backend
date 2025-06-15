import mongoose from "mongoose";
const twitterSchema=new mongoose.Schema({
  
    owners:{
        type:Object.Schema.Types.ObjectId,
        ref:"User",
    },

    content:{
        type:String,
        required:true,
    },
    

},{timestamps:true})

const Twitter=mongoose.model('Twitter','twitterschema')