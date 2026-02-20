import { Router } from "express";
import { authenticate, isMember } from "../middlewares/auth.middleware";
import { MemberController } from "../controllers/member.controller";

const controller = new MemberController();
const router = Router();

router.get("/contracts", authenticate, isMember, controller.getMyContracts);
router.get("/activities", authenticate, isMember, controller.getMyActivities);
router.get("/analytics", authenticate, isMember, controller.getMyAnalytics);

export default router;
