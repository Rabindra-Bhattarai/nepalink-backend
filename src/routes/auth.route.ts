import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { uploads } from "../middlewares/upload.middleware";
import { UserRepository } from "../repositories/user.repository";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";
import { JWT_SECRET } from "../config";

const authController = new AuthController();
const authRouter = Router();
const userRepository = new UserRepository();

// Register
authRouter.post("/register", (req, res, next) =>
  authController.register(req, res).catch(next)
);

// Login
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // validate password
    const bcryptjs = require("bcryptjs");
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // generate token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });

    // set cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: false, // set true in production with HTTPS
      sameSite: "lax",
    });

    //  return token + user data so frontend can use it
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Get current logged-in user
authRouter.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(decoded.id).select("name email role");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// Update logged-in user profile (with optional image)
authRouter.put("/:id", uploads.single("photo"), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.imageUrl = req.file.filename;
    }
    const updatedUser = await userRepository.updateUser(req.params.id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Logout
authRouter.post("/logout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in production
    sameSite: "strict",
  });
  return res.status(200).json({ success: true, message: "Logged out successfully" });
});


export default authRouter;
