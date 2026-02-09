import { Request, Response } from "express";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { UserModel } from "../models/user.model";
import { ResetTokenModel } from "../models/reset-token.model";
import { sendResetEmail } from "../services/email.service";

export class PasswordController {
  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      // generate token
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await ResetTokenModel.create({ userId: user._id, token, expiresAt });

      await sendResetEmail(user.email, token);

      return res.status(200).json({ success: true, message: "Reset email sent" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const resetToken = await ResetTokenModel.findOne({ token });
      if (!resetToken || resetToken.expiresAt < new Date()) {
        return res.status(400).json({ success: false, message: "Invalid or expired token" });
      }

      const user = await UserModel.findById(resetToken.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      user.password = await bcryptjs.hash(password, 10);
      await user.save();

      await ResetTokenModel.deleteOne({ _id: resetToken._id });

      return res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
