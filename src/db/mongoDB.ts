import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI as string;

  const conn = await mongoose.connect(mongoUri, {
    user: process.env.MONGODB_ID,
    pass: process.env.MONGODB_PW,
    dbName: process.env.MONGODB_DBNAME,
  });
  console.log(`MongoDB (biglolkor) Connected: ${conn.connection.host}`);
};

export default connectDB;
