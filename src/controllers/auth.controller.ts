import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsedData = CreateUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: parsedData.error.issues.map(issue => issue.message),
        });
      }

      const userData = parsedData.data;
      const newUser = await userService.createUser(userData);

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsedData = LoginUserDTO.safeParse(req.body);
      if (!parsedData.success) {
        return res.status(400).json({
          success: false,
          message: parsedData.error.issues.map(issue => issue.message),
        });
      }

      const loginData = parsedData.data;
      const { token, user } = await userService.loginUser(loginData);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
        token,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}


///backend bata user ko data tanne controller ho yo

//sir ko 35-B backend code
//Service
//auth controller
//routes--> middleware haru ko kura