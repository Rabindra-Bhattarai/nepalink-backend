import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";
import { ContractModel } from "../models/contract.model";

const chatService = new ChatService();

export class ChatController {
  async getMessages(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contractId } = req.params;
      const contract = await ContractModel.findById(contractId);
      if (!contract) return res.status(404).json({ success: false, message: "Contract not found" });

      const isParticipant =
        contract.memberId.toString() === user._id ||
        contract.nurseId.toString() === user._id;
      if (!isParticipant) return res.status(403).json({ success: false, message: "Access denied" });

      const messages = await chatService.getMessagesByContract(contractId);
      return res.json({ success: true, data: messages });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contractId } = req.params;
      const { receiverId, message, attachments } = req.body;
      if (!message || message.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Message cannot be empty" });
      }
      const savedMessage = await chatService.saveMessage({
        contractId,
        senderId: user._id,
        receiverId,
        message,
        attachments,
      });
      return res.status(201).json({ success: true, data: savedMessage });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async markRead(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const { contractId } = req.params;
      await chatService.markMessagesRead(contractId, user._id);
      return res.json({ success: true, message: "Messages marked as read" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
