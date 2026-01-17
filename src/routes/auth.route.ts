import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();
const authRouter = Router();

authRouter.post("/register", (req, res, next) => authController.register(req, res).catch(next));
authRouter.post("/login", (req, res, next) => authController.login(req, res).catch(next));

export default authRouter;