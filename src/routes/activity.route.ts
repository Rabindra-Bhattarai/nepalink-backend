import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";

const activityController = new ActivityController();
const activityRouter = Router();

// Log activity
activityRouter.post("/", (req, res) => activityController.log(req, res));

// Get activities for a booking
activityRouter.get("/:bookingId", (req, res) => activityController.getByBooking(req, res));

export default activityRouter;
