import { Router } from "express";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";
import { BookingController } from "../controllers/booking.controller";

const controller = new BookingController();
const router = Router();

router.post("/", authenticate, isMember, controller.create);
router.put("/:id/accept", authenticate, isNurse, controller.accept);
router.put("/:id/decline", authenticate, isNurse, controller.decline);

export default router;
