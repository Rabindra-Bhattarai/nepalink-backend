import mongoose from "mongoose";

export async function connectDatabase() {
  try {
    const uri =
      process.env.NODE_ENV === "test"
        ? (global as any).__MONGO_URI__
        : (process.env.MONGODB_URI as string);

    if (!uri) throw new Error("MONGODB_URI not defined");

    console.log("🔎 Trying to connect to:", uri);
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // In tests, don't exit the process — just throw
    if (process.env.NODE_ENV === "test") {
      throw error;
    } else {
      process.exit(1);
    }
  }
}
