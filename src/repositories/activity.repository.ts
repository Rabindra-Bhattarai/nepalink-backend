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
      .populate("memberId", "name email role")
      .populate("nurseId", "name email role");
  }

  async getActivitiesForMember(memberId: string): Promise<IActivity[]> {
    const safeMemberId = mongoose.Types.ObjectId.isValid(memberId)
      ? new mongoose.Types.ObjectId(memberId)
      : memberId;

    return ActivityModel.find({ memberId: safeMemberId })
      .populate("nurseId", "name email role")
      .populate("memberId", "name email role"); // ✅ ensure member info is populated too
  }

  async getActivitiesForNurse(nurseId: string): Promise<IActivity[]> {
    const safeNurseId = mongoose.Types.ObjectId.isValid(nurseId)
      ? new mongoose.Types.ObjectId(nurseId)
      : nurseId;

    return ActivityModel.find({ nurseId: safeNurseId })
      .populate("memberId", "name email role")
      .populate("nurseId", "name email role"); // ✅ ensure nurse info is populated too
  }
}
