import mongoose, { Document, Schema } from "mongoose";

const ContractSchema = new Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["pending", "active", "terminated"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export interface IContract extends Document {
  memberId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  status: "pending" | "active" | "terminated";
  createdAt: Date;
  updatedAt: Date;
}

export const ContractModel = mongoose.model<IContract>("Contract", ContractSchema);
