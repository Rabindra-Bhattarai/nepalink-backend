import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export class AdminController {
  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await adminService.getAllBookings();
      return res.status(200).json({ success: true, data: bookings });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getNurseWorkload(req: Request, res: Response) {
    try {
      const workload = await adminService.getNurseWorkload();
      return res.status(200).json({ success: true, data: workload });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMemberHistory(req: Request, res: Response) {
    try {
      const history = await adminService.getMemberHistory(req.params.id);
      return res.status(200).json({ success: true, data: history });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await adminService.getAnalytics();
      return res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
