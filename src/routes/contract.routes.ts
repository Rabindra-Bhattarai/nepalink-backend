import { Router } from "express";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";
import { ContractController } from "../controllers/contract.controller";

const controller = new ContractController();
const router = Router();

router.post("/", authenticate, isMember, controller.create);
router.put("/:id/activate", authenticate, isNurse, controller.activate);
router.put("/:id/terminate", authenticate, isMember, controller.terminate);
router.get("/my", authenticate, isMember, controller.getByMember);

export default router;
