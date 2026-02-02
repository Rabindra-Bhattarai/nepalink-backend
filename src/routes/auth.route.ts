import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploads } from "../middlewares/upload.middleware";
import { UserRepository } from "../repositories/user.repository";

const authController = new AuthController();
const authRouter = Router();
const userRepository = new UserRepository();

authRouter.post("/register", (req, res, next) => authController.register(req, res).catch(next));
authRouter.post("/login", (req, res, next) => authController.login(req, res).catch(next));

// Update logged-in user profile (with optional image)
authRouter.put("/:id", uploads.single("photo"), async (req, res) => {
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

export default authRouter;
