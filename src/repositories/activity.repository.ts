import { IActivity, ActivityModel } from "../models/activity.model";

export class ActivityRepository {
  async create(data: Partial<IActivity>): Promise<IActivity> {
    const activity = new ActivityModel(data);
    return await activity.save();
  }

  async findByBookingId(bookingId: string): Promise<IActivity[]> {
    return await ActivityModel.find({ bookingId })
      .populate("nurseId", "name email role")
      .sort({ performedAt: -1 });
  }
}
