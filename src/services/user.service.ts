import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";

const userRepository = new UserRepository();

export class UserService {
  async createUser(data: CreateUserDTO) {
    // check if email already exists
    const emailCheck = await userRepository.getUserByEmail(data.email);
    if (emailCheck) {
      throw new HttpError(403, "Email already in use");
    }

    // check if phone already exists
    const phoneCheck = await userRepository.getUserByPhone(data.phone);
    if (phoneCheck) {
      throw new HttpError(403, "Phone number already in use");
    }

    // hash password before saving
    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;

    const newUser = await userRepository.createUser(data);

    // remove password before returning
    const { password, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  async loginUser(data: LoginUserDTO) {
    // find user by email
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }

    // validate password
    const validPassword = await bcryptjs.compare(data.password, user.password);
    if (!validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    // JWT payload aligned with your Dart model
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    // remove password before returning
    const { password, ...userWithoutPassword } = user.toObject();
    return { token, user: userWithoutPassword };
  }

  // ✅ NEW METHOD for profile image upload
  async updateUserImage(userId: string, imageUrl: string) {
    const updatedUser = await userRepository.updateUser(userId, { imageUrl });
    if (!updatedUser) {
      throw new HttpError(404, "User not found");
    }
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    return userWithoutPassword;
  }
}
