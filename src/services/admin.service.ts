import { AdminRepository } from "../repositories/admin.repository";
const repo = new AdminRepository();

export class AdminService {
  getAllUsers(page: number, limit: number, sort: string, role?: string, search?: string) {
    return repo.getAllUsers(page, limit, sort, role, search);
  }
  getUserById(id: string) { return repo.getUserById(id); }
  createUser(data: any) { return repo.createUser(data); }
  updateUser(id: string, data: any) { return repo.updateUser(id, data); }
  deleteUser(id: string) { return repo.deleteUser(id); }
  getAnalytics() { return repo.getAnalytics(); }
}
