import { Router } from "express";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";
import { ContractController } from "../controllers/contract.controller";

const controller = new ContractController();
const router = Router();

router.post("/", authenticate, isMember, controller.create);
router.put("/:id/activate", authenticate, isNurse, controller.activate);

// Request termination
router.put("/:id/request-terminate/member", authenticate, isMember, controller.requestTerminationByMember);
router.put("/:id/request-terminate/nurse", authenticate, isNurse, controller.requestTerminationByNurse);

// Confirm termination
router.put("/:id/confirm-terminate/member", authenticate, isMember, controller.confirmTerminationByMember);
router.put("/:id/confirm-terminate/nurse", authenticate, isNurse, controller.confirmTerminationByNurse);

router.get("/my", authenticate, isMember, controller.getByMember);
router.get("/assigned", authenticate, isNurse, controller.getByNurse);

// ✅ Default export
export default router;
