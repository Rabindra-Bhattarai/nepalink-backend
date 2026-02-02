import express from "express";
import { uploads } from "../middlewares/upload.middleware";
import { UserRepository } from "../repositories/user.repository";
import { isAdmin } from "../middlewares/admin.middleware";
import { UserModel } from "../models/user.model";

const adminRouter = express.Router();
const userRepository = new UserRepository();

//  Create user (JSON or image upload)
adminRouter.post("/users", isAdmin, uploads.single("photo"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const userData = req.body;
    if (req.file) {
      userData.imageUrl = req.file.filename;
    }

    // Quick validation
    if (!userData.name || !userData.email || !userData.role) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const newUser = await userRepository.createUser(userData);
    return res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    console.error("Create user error:", error); // ✅ log the actual error
    return res.status(500).json({ success: false, message: error.message });
  }
});


//  Get all users with pagination + optional filters
adminRouter.get("/users", isAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const role = req.query.role as string;
    const name = req.query.name as string;

    const query: any = {};
    if (role) query.role = role;
    if (name) query.name = new RegExp(name, "i"); // case-insensitive partial match

    const users = await UserModel.find(query).skip(skip).limit(limit);
    const total = await UserModel.countDocuments(query);

    return res.status(200).json({ success: true, data: users, total, page, limit });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

//  Get single user
adminRouter.get("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update user (JSON or image upload)
adminRouter.put("/users/:id", isAdmin, uploads.single("photo"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }
    const updatedUser = await userRepository.updateUser(req.params.id, updateData);
    if (!updatedUser) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

//  Delete user
adminRouter.delete("/users/:id", isAdmin, async (req, res) => {
  try {
    const deleted = await userRepository.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default adminRouter;
