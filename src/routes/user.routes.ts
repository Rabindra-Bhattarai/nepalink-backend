import express from "express";
import { uploads } from "../middlewares/upload.middleware";
import { updateUserProfilePic } from "../controllers/user.controller";

const router = express.Router();

// Upload profile photo
router.post("/:id/upload", uploads.single("photo"), updateUserProfilePic);

export default router;
