import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

// Verify JWT and attach decoded user
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.auth_token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded: any = jwt.verify(token, JWT_SECRET);

    // Debug log to confirm payload structure
   // console.log("Decoded JWT:", decoded);

    (req as any).user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Role-based guards
export const isMember = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "member") {
    return res.status(403).json({ success: false, message: "Access denied. Members only." });
  }
  next();
};

export const isNurse = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "nurse") {
    return res.status(403).json({ success: false, message: "Access denied. Nurses only." });
  }
  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user?.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied. Admins only." });
  }
  next();
};

// ✅ Allow both members and nurses
export const isMemberOrNurse = (req: Request, res: Response, next: NextFunction) => {
  const role = (req as any).user?.role;
  if (!["member", "nurse"].includes(role)) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Members or Nurses only.",
    });
  }
  next();
};
