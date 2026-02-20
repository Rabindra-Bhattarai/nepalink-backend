import mongoose, { Document, Schema } from "mongoose";

const BookingSchema = new Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
}, { timestamps: true });

export interface IBooking extends Document {
  memberId: mongoose.Types.ObjectId;
  nurseId: mongoose.Types.ObjectId;
  date: Date;
  status: "pending" | "accepted" | "declined";
}

export const BookingModel = mongoose.model<IBooking>("Booking", BookingSchema);
