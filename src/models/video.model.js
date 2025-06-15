import mongoose from "mongoose";
import mongooseaggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new mongoose.Schema({
    video: {
        type: String, // Cloudinary URL
        required: true,
    },
    thumbnail: {
        type: String, // Cloudinary URL
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String, // Duration (can be ISO or simple string)
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, {
    timestamps: true
});

// ✅ Plugin Register
videoSchema.plugin(mongooseaggregatePaginate);

// ✅ Model Export
const Video = mongoose.model("Video", videoSchema);
export default Video;
