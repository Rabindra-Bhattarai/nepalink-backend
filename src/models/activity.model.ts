import mongoose, { Document, Schema } from "mongoose";

const ActivitySchema = new Schema(
  {
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    nurseId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String, required: true },
    performedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export interface IActivity extends Document {
  bookingId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  notes: string;
  performedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ActivityModel = mongoose.model<IActivity>("Activity", ActivitySchema);
