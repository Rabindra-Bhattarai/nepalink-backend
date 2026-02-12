import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { CreateActivityDTO } from "../dtos/activity.dto";
import { ActivityType } from "../types/activity.type";

const activityService = new ActivityService();

export class ActivityController {
  async log(req: Request, res: Response) {
    try {
      const parsed = CreateActivityDTO.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: parsed.error.issues.map((i) => i.message),
        });
      }

      const activity: ActivityType = await activityService.logActivity(parsed.data);

      return res.status(201).json({
        success: true,
        data: activity,
        links: {
          self: `/api/activities/${activity._id}`,
          booking: `/api/bookings/${activity.bookingId}`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getByBooking(req: Request, res: Response) {
    try {
      const activities: ActivityType[] = await activityService.getActivitiesForBooking(req.params.bookingId);
      return res.status(200).json({
        success: true,
        data: activities,
        links: {
          self: `/api/activities/${req.params.bookingId}`,
        },
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
