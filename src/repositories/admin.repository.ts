import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";

export class AdminRepository {
  async getAllUsers(page: number, limit: number, sort: string, role?: string, search?: string) {
    const query: any = {};

    // Filtering by role
    if (role) query.role = role;

    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Sorting
    const sortOption: any = {};
    if (sort) {
      const [field, order] = sort.split(":"); // e.g. "name:asc"
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    const users = await UserModel.find(query)
      .select("_id name email role phone imageUrl createdAt updatedAt")
      .skip(skip)
      .limit(limit)
      .sort(sortOption);

    const total = await UserModel.countDocuments(query);

    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1
      }
    };
  }

  async getUserById(id: string) {
    return UserModel.findById(id).select("_id name email role phone imageUrl createdAt updatedAt");
  }



async createUser(data: any) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  return UserModel.create({
    name: data.name,
    email: data.email,
    role: data.role,
    phone: data.phone,
    password: hashedPassword,
    imageUrl: data.imageUrl,
  });
}



  async updateUser(id: string, data: any) {
    return UserModel.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteUser(id: string) {
    return UserModel.findByIdAndDelete(id);
  }

  async getAnalytics() {
    const totalUsers = await UserModel.countDocuments();
    const nurses = await UserModel.countDocuments({ role: "nurse" });
    const members = await UserModel.countDocuments({ role: "member" });
    const admins = await UserModel.countDocuments({ role: "admin" });

    return { totalUsers, nurses, members, admins };
  }
}
