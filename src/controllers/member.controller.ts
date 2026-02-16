import { Request, Response } from "express";
import { BookingModel } from "../models/booking.model";
import { ActivityModel } from "../models/activity.model";

export class MemberController {
  async getMyBookings(req: Request, res: Response) {
    try {
      const memberId = (req as any).user._id;
      const bookings = await BookingModel.find({ memberId })
        .populate("nurseId", "_id name email role");

      return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message });
    }
  }

  async getMyActivities(req: Request, res: Response) {
    try {
      const memberId = (req as any).user._id;
      const bookings = await BookingModel.find({ memberId });
      const activities = await ActivityModel.find({
        bookingId: { $in: bookings.map((b) => b._id) },
      }).populate("nurseId", "_id name email role");

      return res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message });
    }
  }
}
