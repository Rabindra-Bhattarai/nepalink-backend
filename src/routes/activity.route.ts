import { Router } from "express";
import { authenticate, isNurse } from "../middlewares/auth.middleware";
import { ActivityController } from "../controllers/activity.controller";

const controller = new ActivityController();
const router = Router();

router.post("/", authenticate, isNurse, controller.log);
router.get("/:contractId", authenticate, controller.getByContract);

export default router;
