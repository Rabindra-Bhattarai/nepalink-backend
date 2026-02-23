import express from "express";
import { uploads } from "../middlewares/upload.middleware";
import { updateUserProfilePic } from "../controllers/user.controller";
import { UserRepository } from "../repositories/user.repository";

const router = express.Router();
const userRepository = new UserRepository();

// Fetch user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await userRepository.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Update user profile (JSON body)
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await userRepository.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Upload profile photo
router.post("/:id/upload", uploads.single("photo"), updateUserProfilePic);

// ✅ New: Fetch nurses or all users
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    if (role) {
      const users = await userRepository.getUsersByRole(role as "nurse" | "member" | "admin");
      return res.status(200).json({ success: true, data: users });
    }
    const users = await userRepository.getAllUsers();
    return res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
