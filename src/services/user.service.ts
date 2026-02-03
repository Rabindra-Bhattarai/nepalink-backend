import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO & { role?: "nurse" | "member" | "admin" }) {
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }

    const phoneCheck = await userRepository.getUserByPhone(data.phone);
    if (phoneCheck) {
      throw new HttpError(403, "Phone number already in use");
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    // Ensure role is one of the allowed values, default to nurse
    const role: "nurse" | "member" | "admin" = data.role ?? "nurse";

    const newUser = await userRepository.createUser({ ...data, role });

    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async loginUser(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const validPassword = await bcryptjs.compare(data.password, user.password);
    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    const { password, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
  }

  async updateUserImage(userId: string, imageUrl: string) {
    const updatedUser = await userRepository.updateUser(userId, { imageUrl });
    if (!updatedUser) {
      throw new HttpError(404, "User not found");
    }
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }
}
