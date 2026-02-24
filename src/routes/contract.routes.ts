import { Router } from "express";
import { authenticate, isMember, isNurse } from "../middlewares/auth.middleware";
import { ContractController } from "../controllers/contract.controller";

const controller = new ContractController();
const router = Router();

// Create contract (member only)
router.post("/", authenticate, isMember, (req, res) => controller.create(req, res));

// Activate contract (nurse only)
router.put("/:id/activate", authenticate, isNurse, (req, res) => controller.activate(req, res));

// Request termination
router.put("/:id/request-terminate/member", authenticate, isMember, (req, res) => controller.requestTerminationByMember(req, res));
router.put("/:id/request-terminate/nurse", authenticate, isNurse, (req, res) => controller.requestTerminationByNurse(req, res));

// Confirm termination
router.put("/:id/confirm-terminate/member", authenticate, isMember, (req, res) => controller.confirmTerminationByMember(req, res));
router.put("/:id/confirm-terminate/nurse", authenticate, isNurse, (req, res) => controller.confirmTerminationByNurse(req, res));

// Get contracts by role
router.get("/my", authenticate, isMember, (req, res) => controller.getByMember(req, res));
router.get("/assigned", authenticate, isNurse, (req, res) => controller.getByNurse(req, res));

// NEW: Get contract by ID (for chat header)
router.get("/:id", authenticate, (req, res) => controller.getById(req, res));

export default router;
