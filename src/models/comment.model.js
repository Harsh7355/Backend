import mongoose from "mongoose";
import mongooseaggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

commentSchema.plugin(mongooseaggregatePaginate);

const Comment = mongoose.model('Comment', commentSchema); // ✅ Fix here

export default Comment;
