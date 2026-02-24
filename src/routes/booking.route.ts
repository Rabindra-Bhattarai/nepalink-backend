import { Router } from "express";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";
import { isMemberOrNurse } from "../middlewares/ismemberornurse.middleware";
import { BookingController } from "../controllers/booking.controller";

const controller = new BookingController();
const router = Router();

// Member: get all their bookings
router.get("/", authenticate, isMember, controller.getMyBookings);

// Member: create a new booking
router.post("/", authenticate, isMember, controller.create);

// Nurse: accept a booking
router.put("/:id/accept", authenticate, isNurse, controller.accept);

// Nurse: decline a booking
router.put("/:id/decline", authenticate, isNurse, controller.decline);

// ✅ Allow both Member and Nurse to cancel
router.put("/:id/cancel", authenticate, isMemberOrNurse, controller.cancel);

export default router;
