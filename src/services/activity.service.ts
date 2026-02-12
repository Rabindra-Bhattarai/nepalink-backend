import mongoose from "mongoose";
import { ActivityRepository } from "../repositories/activity.repository";
import { CreateActivityDTO } from "../dtos/activity.dto";
import { HttpError } from "../errors/http-error";
import { ActivityType } from "../types/activity.type";

const activityRepo = new ActivityRepository();

export class ActivityService {
  async logActivity(data: CreateActivityDTO): Promise<ActivityType> {
    const activity = await activityRepo.create({
      bookingId: new mongoose.Types.ObjectId(data.bookingId),
      nurseId: new mongoose.Types.ObjectId(data.nurseId),
      notes: data.notes,
      performedAt: new Date(),
    });

    return activity as unknown as ActivityType;
  }

  async getActivitiesForBooking(bookingId: string): Promise<ActivityType[]> {
    const activities = await activityRepo.findByBookingId(bookingId);
    if (!activities || activities.length === 0) {
      throw new HttpError(404, "No activities found for this booking");
    }
    return activities as unknown as ActivityType[];
  }
}
