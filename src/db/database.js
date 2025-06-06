import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectdb = async () => {
  try {
    const db = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`MONGODB IS CONNECTED at ${db.connection.host}`);
  } catch (error) {
    console.log(" MONGODB CONNECTION FAILED", error);
    process.exit(1);
  }
};

export default connectdb;
