import mongoose from "mongoose";

const likeSchema=new mongoose.Schema({
   
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    },

    video:{
        type:Object.Schema.Types.ObjectId,
        ref:"Video",
    },
    
    likeby:{
        type:Object.Schema.Types.ObjectId,
        ref:"User",
    },

    tweet:{
        type:Object.Schema.Types.ObjectId,
        ref:"Tweet",
    }
    

},{timestamps:true})

const Like=mongoose.model('Like',likeSchema)

export default Like;