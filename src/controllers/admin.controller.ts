import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

export class AdminController {
  // GET all users (with pagination, sorting, filtering, search)
  async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || "createdAt:desc";
      const role = req.query.role as string;
      const search = req.query.search as string;

      const result = await adminService.getAllUsers(page, limit, sort, role, search);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // GET single user
  async getUserById(req: Request, res: Response) {
    try {
      const user = await adminService.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // CREATE user
  async createUser(req: Request, res: Response) {
    try {
      const data: any = { ...req.body };
      if (req.file) {
        // ✅ Save uploaded file name into imageUrl
        data.imageUrl = req.file.filename;
      }
      const user = await adminService.createUser(data);
      return res.status(201).json({ success: true, data: user });
    } catch (error: any) {
      console.error("Create user error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // UPDATE user
  async updateUser(req: Request, res: Response) {
    try {
      const updateData: any = { ...req.body };
      if (req.file) {
        // ✅ Ensure photo updates correctly
        updateData.imageUrl = req.file.filename;
      }
      const user = await adminService.updateUser(req.params.id, updateData);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, data: user });
    } catch (error: any) {
      console.error("Update user error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE user
  async deleteUser(req: Request, res: Response) {
    try {
      const deleted = await adminService.deleteUser(req.params.id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User deleted" });
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
