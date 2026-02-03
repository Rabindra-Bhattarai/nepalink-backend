import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Read token from cookie
    const token = req.cookies?.auth_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    // attach decoded user info to request for later use
    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
