import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const bookingController = new BookingController();
const bookingRouter = Router();

// Create booking
bookingRouter.post("/", (req, res) => bookingController.create(req, res));

// Get all bookings (with filters, sorting, pagination)
bookingRouter.get("/", (req, res) => bookingController.getAll(req, res));

// Get booking by ID
bookingRouter.get("/:id", (req, res) => bookingController.getById(req, res));

// Update booking status (accept/decline)
bookingRouter.patch("/:id/status", (req, res) => bookingController.updateStatus(req, res));

export default bookingRouter;
