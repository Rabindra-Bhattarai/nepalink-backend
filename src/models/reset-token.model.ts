import mongoose, { Document, Schema } from "mongoose";

const ResetTokenSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export interface IResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
}

export const ResetTokenModel = mongoose.model<IResetToken>("ResetToken", ResetTokenSchema);
