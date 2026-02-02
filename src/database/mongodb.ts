import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const uri = process.env.MONGODB_URI as string;
    console.log("🔎 Trying to connect to:", uri);

    if (!uri) throw new Error("MONGODB_URI not defined");

    await mongoose.connect(uri);
    console.log(" Connected to MongoDB");
  } catch (error) {
    console.error(" MongoDB connection error:", error);
    process.exit(1);
  }
}
