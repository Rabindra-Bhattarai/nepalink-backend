import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { UserModel } from "./src/models/user.model";
import { MONGODB_URI } from "./src/config";

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Connected to MongoDB");

    const existingAdmin = await UserModel.findOne({ email: "admin@example.com" });
    if (existingAdmin) {
      console.log("⚠️ Admin already exists. Skipping creation.");
      return;
    }

    const hashedPassword = await bcryptjs.hash("Admin@123", 10);

    const admin = await UserModel.create({
      name: "Super Admin",
      email: "admin@example.com",
      phone: "9800000000",
      password: hashedPassword,
      role: "admin",
    });

    console.log(" Admin created:", admin.email);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedAdmin();
