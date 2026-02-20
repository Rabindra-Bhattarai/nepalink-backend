// controllers/admin.controller.ts
import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export class AdminController {
  // controllers/admin.controller.ts
async getAllUsers(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = (req.query.sort as string) || "createdAt:desc";
    const role = req.query.role as string;
    const search = req.query.search as string;

    const result = await adminService.getAllUsers(page, limit, sort, role, search);
    return res.status(200).json({ success: true, ...result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}


  // VIEW single user
  async getUserById(req: Request, res: Response) {
    try {
      const user = await adminService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CREATE user
  async createUser(req: Request, res: Response) {
    try {
      const user = await adminService.createUser(req.body);
      return res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // EDIT user
  async updateUser(req: Request, res: Response) {
    try {
      const user = await adminService.updateUser(req.params.id, req.body);
      if (!user) return res.status(404).json({ success: false, message: "User not found" });
      return res.json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE user
  async deleteUser(req: Request, res: Response) {
    try {
      const deleted = await adminService.deleteUser(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "User not found" });
      return res.json({ success: true, message: "User deleted" });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ANALYTICS
  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await adminService.getAnalytics();
      return res.status(200).json({ success: true, data: analytics });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}
