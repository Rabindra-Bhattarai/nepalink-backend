import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { authenticate, isNurse } from "../middlewares/auth.middleware";

const activityController = new ActivityController();
const activityRouter = Router();

// Nurses log activity
activityRouter.post("/", authenticate, isNurse, (req, res) => activityController.log(req, res));

// Members & Nurses can view activities for a booking
activityRouter.get("/:bookingId", authenticate, (req, res) => activityController.getByBooking(req, res));

export default activityRouter;
