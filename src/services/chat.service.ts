import { ChatMessageModel } from "../models/chat-message.model";
import { ContractModel } from "../models/contract.model";

export class ChatService {
  async saveMessage({
    contractId,
    senderId,
    receiverId,
    message,
    attachments,
  }: {
    contractId: string;
    senderId: string;
    receiverId: string;
    message: string;
    attachments?: string[];
  }) {
    const contract = await ContractModel.findOne({
      _id: contractId,
      status: "active",
    });
    if (!contract) throw new Error("No active contract found for chat");
    if (!receiverId) throw new Error("ReceiverId is required");

    const chatMessage = new ChatMessageModel({
      contractId,
      senderId,
      receiverId,
      message,
      attachments,
      isRead: false,
    });
    return await chatMessage.save();
  }

  async getMessagesByContract(contractId: string) {
    return await ChatMessageModel.find({ contractId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role")
      .populate("receiverId", "name role");
  }

  async markMessagesRead(contractId: string, userId: string) {
    return await ChatMessageModel.updateMany(
      { contractId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );
  }
}
