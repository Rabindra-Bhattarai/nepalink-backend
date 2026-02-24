import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { ContractModel } from "../models/contract.model";
import { ChatService } from "../services/chat.service";

const chatService = new ChatService();

export function registerChatHandlers(io: Server) {
  io.on("connection", async (socket: Socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return socket.disconnect(true);

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      socket.on("joinRoom", async ({ contractId }) => {
        const contract = await ContractModel.findOne({ _id: contractId, status: "active" });
        if (!contract) return socket.emit("error", "No active contract found");
        if (contract.memberId.toString() !== userId && contract.nurseId.toString() !== userId) {
          return socket.emit("error", "Access denied");
        }
        socket.join(contractId.toString());
        socket.emit("joinedRoom", { contractId });
      });

      socket.on("sendMessage", async ({ contractId, receiverId, message }) => {
        try {
          const savedMessage = await chatService.saveMessage({
            contractId,
            senderId: userId,
            receiverId,
            message,
          });
          io.to(contractId.toString()).emit("receiveMessage", savedMessage);
        } catch (err: any) {
          socket.emit("error", err.message);
        }
      });
    } catch {
      socket.disconnect(true);
    }
  });
}
