import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, // cloudinary image URL
        required: true,
    },
    coverimage: {
        type: String,
    },
    watchhistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video", // 🔍 Make sure 'Video' model exists
        }
    ],
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    refreshtoken: {
        type: String,
    }
}, {
    timestamps: true
});


const User = mongoose.model("User", userSchema);
export default User;
