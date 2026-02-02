import express from "express";
import { uploads } from "../middlewares/upload.middleware";
import { UserRepository } from "../repositories/user.repository";
import { isAdmin } from "../middlewares/admin.middleware";

const adminRouter = express.Router();
const userRepository = new UserRepository();

// Create user with image upload
adminRouter.post("/users", isAdmin, uploads.single("photo"), async (req, res) => {
  try {
    const userData = req.body;
    if (req.file) {
      userData.imageUrl = req.file.filename;
    }
    const newUser = await userRepository.createUser(userData);
    return res.status(201).json({ success: true, data: newUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get all users
adminRouter.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get single user
adminRouter.get("/users/:id", isAdmin, async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update user with optional image
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

// Delete user
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
