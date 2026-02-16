import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.auth_token || req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const isMember = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== "member") {
    return res.status(403).json({ success: false, message: "Access denied. Members only." });
  }
  next();
};

export const isNurse = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== "nurse") {
    return res.status(403).json({ success: false, message: "Access denied. Nurses only." });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};
