import mongoose from "mongoose";

const connectdb = async () => {
  try {
    const db = await mongoose.connect('mongodb+srv://Adhamkhor:Mahakal%401234@cluster0.rqwqs4c.mongodb.net/VIDEOTUBE?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`✅ MONGODB IS CONNECTED at ${db.connection.host}`);
  } catch (error) {
    console.log("❌ MONGODB CONNECTION FAILED", error.message);
    process.exit(1);
  }
};

export default connectdb;
