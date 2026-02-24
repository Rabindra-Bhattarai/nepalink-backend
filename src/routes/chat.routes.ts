import { Router } from "express";
import { ChatController } from "../controllers/chat.controller";
import { authenticate, isMemberOrNurse } from "../middlewares/auth.middleware";

const router = Router();
const chatController = new ChatController();

router.get("/:contractId", authenticate, isMemberOrNurse, (req, res) => chatController.getMessages(req, res));
router.post("/:contractId/message", authenticate, isMemberOrNurse, (req, res) => chatController.sendMessage(req, res));
router.patch("/:contractId/read", authenticate, isMemberOrNurse, (req, res) => chatController.markRead(req, res));

export default router;
