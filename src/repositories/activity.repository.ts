import { IActivity, ActivityModel } from "../models/activity.model";

export class ActivityRepository {
  async create(data: Partial<IActivity>): Promise<IActivity> {
    const activity = new ActivityModel(data);
    return await activity.save();
  }

  async findByContractId(contractId: string): Promise<IActivity[]> {
    return ActivityModel.find({ contractId })
      .populate("nurseId", "name email role")
      .sort({ performedAt: -1 });
  }
}
