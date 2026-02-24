import { Request, Response } from "express";
import { ActivityService } from "../services/activity.service";
import { ContractModel } from "../models/contract.model";
import mongoose from "mongoose";

const activityService = new ActivityService();

export class ActivityController {
  // ✅ Both member and nurse can create activity
  async create(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      const userId = user._id || user.id; // supports both
      let contract;

      if (user.role === "member") {
        contract = await ContractModel.findOne({
          memberId: userId,
          status: "active"
        });
      } else if (user.role === "nurse") {
        contract = await ContractModel.findOne({
          nurseId: userId,
          status: "active"
        });
      } else {
        return res.status(403).json({ success: false, message: "Access denied" });
      }

      if (!contract) {
        return res.status(400).json({ success: false, message: "No active contract found" });
      }

      const activity = await activityService.createActivity({
        memberId: contract.memberId,
        nurseId: contract.nurseId,
        description: req.body.description,
        date: req.body.date,
        vitalSigns: req.body.vitalSigns,
        dailyCare: req.body.dailyCare,
        medicalTracking: req.body.medicalTracking,
        collaboration: req.body.collaboration,
        safetyVerification: req.body.safetyVerification,
        status: user.role === "nurse" ? "completed" : "pending"
      });

      console.log("✅ Activity created:", activity);

      return res.status(201).json({ success: true, data: activity });
    } catch (error: any) {
      console.error("❌ Error in create:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Only nurses can update status
  async updateStatus(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "nurse") {
        return res.status(403).json({ success: false, message: "Access denied. Nurses only." });
      }

      const activity = await activityService.updateActivity(req.params.id, {
        status: req.body.status,
        vitalSigns: req.body.vitalSigns,
        dailyCare: req.body.dailyCare,
        medicalTracking: req.body.medicalTracking,
        collaboration: req.body.collaboration,
        safetyVerification: req.body.safetyVerification,
      });

      if (!activity) {
        return res.status(404).json({ success: false, message: "Activity not found" });
      }

      console.log("✅ Activity updated:", activity);

      return res.json({ success: true, data: activity });
    } catch (error: any) {
      console.error("❌ Error in updateStatus:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Member views their activities
  async getByMember(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "member") {
        return res.status(403).json({ success: false, message: "Access denied. Members only." });
      }

      const userId = user._id || user.id;
      const safeMemberId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      console.log("🔎 getByMember user:", user);
      console.log("🔎 Using memberId:", safeMemberId);

      const activities = await activityService.getActivitiesForMember(safeMemberId);

      console.log("✅ Activities fetched:", activities);

      return res.json({ success: true, data: activities });
    } catch (error: any) {
      console.error("❌ Error in getByMember:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ✅ Nurse views their activities
  async getByNurse(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      if (user.role !== "nurse") {
        return res.status(403).json({ success: false, message: "Access denied. Nurses only." });
      }

      const userId = user._id || user.id;
      const safeNurseId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      console.log("🔎 getByNurse user:", user);
      console.log("🔎 Using nurseId:", safeNurseId);

      const activities = await activityService.getActivitiesForNurse(safeNurseId);

      console.log("✅ Activities fetched:", activities);

      return res.json({ success: true, data: activities });
    } catch (error: any) {
      console.error("❌ Error in getByNurse:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
