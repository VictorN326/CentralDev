import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MONGODB_URL is missing");
  }

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "CentralDev",
    });
    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("DEBUG: MongoDB connection failed", error);
  }
};
