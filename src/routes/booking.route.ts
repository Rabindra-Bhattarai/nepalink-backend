import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";

const bookingController = new BookingController();
const bookingRouter = Router();

// Members create bookings
bookingRouter.post("/", authenticate, isMember, (req, res) => bookingController.create(req, res));

// Members & Nurses can view bookings
bookingRouter.get("/", authenticate, (req, res) => bookingController.getAll(req, res));
bookingRouter.get("/:id", authenticate, (req, res) => bookingController.getById(req, res));

// Nurses update booking status
bookingRouter.patch("/:id/status", authenticate, isNurse, (req, res) => bookingController.updateStatus(req, res));

// NEW: Nurses decline booking
bookingRouter.patch("/:id/decline", authenticate, isNurse, (req, res) => bookingController.decline(req, res));

export default bookingRouter;
