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

    // Populate nurse details before returning
    const populated = await activity.populate("nurseId", "_id name email role");
    return populated as unknown as ActivityType;
  }


  async getActivitiesForBooking(bookingId: string): Promise<ActivityType[]> {
    const activities = await activityRepo.findByBookingId(bookingId);

    if (!activities || activities.length === 0) {
      throw new HttpError(404, "No activities found for this booking");
    }

    // Populate nurse details for each activity
    const populated = await Promise.all(
      activities.map((act) => act.populate("nurseId", "_id name email role"))
    );

    return populated as unknown as ActivityType[];
  }
}
