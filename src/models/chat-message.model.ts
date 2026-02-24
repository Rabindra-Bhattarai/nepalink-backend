import mongoose, { Schema, Document } from "mongoose";

export interface ChatMessage extends Document {
  contractId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema = new Schema(
  {
    contractId: { type: Schema.Types.ObjectId, ref: "Contract", required: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    isRead: { type: Boolean, default: false },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export const ChatMessageModel = mongoose.model<ChatMessage>(
  "ChatMessage",
  ChatMessageSchema
);
