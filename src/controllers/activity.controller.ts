import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { ActivityType } from "../types/activity.type";

const activityService = new ActivityService();

export class ActivityController {
  async log(req: Request, res: Response) {
    try {
      const { contractId, description, notes, date } = req.body;

      if (!contractId) {
        return res.status(400).json({ success: false, message: "Must provide contractId" });
      }
      if (!notes) {
        return res.status(400).json({ success: false, message: "Must provide notes" });
      }

      const activity: ActivityType = await activityService.logActivity({
  contractId,
  nurseId: req.body.nurseId ?? (req as any).user._id,
  description,
  notes,
  date,
});


      

      return res.status(201).json({ success: true, data: activity });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message });
    }
  }

  async getByContract(req: Request, res: Response) {
    try {
      const activities: ActivityType[] = await activityService.getActivitiesForContract(
        req.params.contractId
      );
      return res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({ success: false, message: error.message });
    }
  }
}
