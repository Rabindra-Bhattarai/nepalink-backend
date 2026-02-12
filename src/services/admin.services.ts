import { BookingModel } from "../models/booking.model";
import { ActivityModel } from "../models/activity.model";
import { UserModel } from "../models/user.model";

export class AdminService {
  async getAllBookings() {
    return BookingModel.find().populate("memberId", "name email role").populate("nurseId", "name email role");
  }

  async getNurseWorkload() {
    const nurses = await UserModel.find({ role: "nurse" });
    const workload = await Promise.all(
      nurses.map(async (nurse) => {
        const bookings = await BookingModel.countDocuments({ nurseId: nurse._id });
        const activities = await ActivityModel.countDocuments({ nurseId: nurse._id });
        return {
          nurse,
          bookings,
          activities,
        };
      })
    );
    return workload;
  }

  async getMemberHistory(memberId: string) {
    const bookings = await BookingModel.find({ memberId }).populate("nurseId", "name email role");
    const activities = await ActivityModel.find({ bookingId: { $in: bookings.map((b) => b._id) } })
      .populate("nurseId", "name email role");
    return { bookings, activities };
  }

  async getAnalytics() {
    const totalBookings = await BookingModel.countDocuments();
    const accepted = await BookingModel.countDocuments({ status: "accepted" });
    const declined = await BookingModel.countDocuments({ status: "declined" });

    const acceptanceRate = totalBookings > 0 ? (accepted / totalBookings) * 100 : 0;

    const totalActivities = await ActivityModel.countDocuments();
    const avgActivitiesPerBooking = totalBookings > 0 ? totalActivities / totalBookings : 0;

    const nurseCount = await UserModel.countDocuments({ role: "nurse" });
    const nurseUtilization = nurseCount > 0 ? accepted / nurseCount : 0;

    return {
      totalBookings,
      accepted,
      declined,
      acceptanceRate,
      totalActivities,
      avgActivitiesPerBooking,
      nurseUtilization,
    };
  }
}
