import { Request, Response, NextFunction } from "express";

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
