import { Request, Response } from "express";
import { MemberService } from "../services/member.service";

const memberService = new MemberService();

export class MemberController {
  async getMyContracts(req: Request, res: Response) {
    try {
      const contracts = await memberService.getContracts((req as any).user._id);
      return res.status(200).json({ success: true, data: contracts });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMyActivities(req: Request, res: Response) {
    try {
      const activities = await memberService.getActivities((req as any).user._id);
      return res.status(200).json({ success: true, data: activities });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMyAnalytics(req: Request, res: Response) {
    try {
      const analytics = await memberService.getAnalytics((req as any).user._id);
      return res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
