// routes/admin.routes.ts
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { isAdmin } from "../middlewares/admin.middleware";
import { AdminController } from "../controllers/admin.controller";

const controller = new AdminController();
const router = Router();

// VIEW
router.get("/users", authenticate, isAdmin, controller.getAllUsers);
router.get("/users/:id", authenticate, isAdmin, controller.getUserById);

// CREATE
router.post("/users", authenticate, isAdmin, controller.createUser);

// EDIT
router.patch("/users/:id", authenticate, isAdmin, controller.updateUser);

// DELETE
router.delete("/users/:id", authenticate, isAdmin, controller.deleteUser);

// ANALYTICS
router.get("/analytics", authenticate, isAdmin, controller.getAnalytics);

export default router;
