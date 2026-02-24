import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/auth.middleware";
import { AdminController } from "../controllers/admin.controller";
import { uploads } from "../middlewares/upload.middleware";

const controller = new AdminController();
const router = Router();

// VIEW
router.get("/users", authenticate, isAdmin, controller.getAllUsers);
router.get("/users/:id", authenticate, isAdmin, controller.getUserById);

// CREATE
router.post("/users", authenticate, isAdmin, uploads.single("photo"), controller.createUser);

// UPDATE
router.patch("/users/:id", authenticate, isAdmin, uploads.single("photo"), controller.updateUser);

// DELETE
router.delete("/users/:id", authenticate, isAdmin, controller.deleteUser);

// ANALYTICS
router.get("/analytics", authenticate, isAdmin, controller.getAnalytics);

export default router;
