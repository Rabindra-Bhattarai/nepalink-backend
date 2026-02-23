import { Router } from "express";
import { authenticate, isMember, isNurse, isMemberOrNurse } from "../middlewares/auth.middleware";
import { ActivityController } from "../controllers/activity.controller";

const controller = new ActivityController();
const router = Router();

//  Both members and nurses can create activities
router.post("/", authenticate, isMemberOrNurse, controller.create.bind(controller));

//  Only nurses can update status
router.put("/:id/status", authenticate, isNurse, controller.updateStatus.bind(controller));

//  Member views their own activities
router.get("/my", authenticate, isMember, controller.getByMember.bind(controller));

//  Nurse views their assigned activities
router.get("/assigned", authenticate, isNurse, controller.getByNurse.bind(controller));

export default router;
