import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import path from "path";
import fs from "fs";

export const updateUserProfilePic = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete old file if not default
    if (user.imageUrl && user.imageUrl !== "default-profile.png") {
      const oldPath = path.join(__dirname, "../../uploads", user.imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    // Save new file
    const imageUrl = req.file.filename; //store only filename
    user.imageUrl = imageUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile image updated",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
