import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken"

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

// for encryptin the password
userSchema.pre("save",async function(next){
    const user=this;

    if(!user.isModified("password")){
        return next();
    }
    try{
        const hash_password=await bcrypt.hash(user.password,10)
        user.password=hash_password;
        next()
    }catch(error){
         console.log("Encryption error",error)
         next(error)   
    }
})

// for checking the password
userSchema.methods.ispassword = async function (password) {
  try {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid; 
  } catch (error) {
    console.error("Error while comparing password:", error);
    return false; 
  }
};

// for generating tokens
userSchema.methods.generateToken=async function(){
    try{
        const token= jsonwebtoken.sign(
            {
               username:this.username,
               email:this.email,
               userid:this._id
            },
                process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
            },
    )
        return token;
    }
    catch(error){
        console.log("Token is not created",error);
        return null;
    }
}

userSchema.methods.generateRefreshToken= async function(){
    try{
        const token= jsonwebtoken.sign(
            {
               userid:this._id
            },
                process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
            },
    )
        return token;
    }
    catch(error){
        console.log("Token is not created",error);
        return null;
    }
}

const User = mongoose.model("User", userSchema);
export default User;
