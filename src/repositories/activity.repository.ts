import mongoose from "mongoose";
import { IActivity, ActivityModel } from "../models/activity.model";

export class ActivityRepository {
  async create(data: Partial<IActivity>): Promise<IActivity> {
    const activity = new ActivityModel(data);
    return await activity.save();
  }

  async updateActivity(
    id: string,
    updateData: Partial<IActivity>
  ): Promise<IActivity | null> {
    return ActivityModel.findByIdAndUpdate(id, updateData, { new: true })
      .populate("memberId nurseId", "name email role");
  }

  async getActivitiesForMember(memberId: string): Promise<IActivity[]> {
    return ActivityModel.find({ memberId: new mongoose.Types.ObjectId(memberId) })
      .populate("nurseId", "name email role");
  }

  async getActivitiesForNurse(nurseId: string): Promise<IActivity[]> {
    return ActivityModel.find({ nurseId: new mongoose.Types.ObjectId(nurseId) })
      .populate("memberId", "name email role");
  }
}
