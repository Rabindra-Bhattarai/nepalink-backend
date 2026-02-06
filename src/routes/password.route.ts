import { Router } from "express";
import { PasswordController } from "../controllers/password.controller";

const passwordController = new PasswordController();
const passwordRouter = Router();

// Forgot password send reset email
passwordRouter.post("/forgot-password", (req, res) =>
  passwordController.forgotPassword(req, res)
);

// Reset password verify token + update password
passwordRouter.post("/reset-password/:token", (req, res) =>
  passwordController.resetPassword(req, res)
);

export default passwordRouter;
