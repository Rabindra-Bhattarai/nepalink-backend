import express, { Application, Request, Response } from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.route";
import passwordRouter from "./routes/password.route";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import memberRoutes from "./routes/member.routes";
import bookingRouter from "./routes/booking.route";
import activityRouter from "./routes/activity.route";
import contractRouter from "./routes/contract.routes";

const app: Application = express();

// Allow frontend dev server (web) and physical device (Flutter)
app.use(cors({
  origin: [
    "http://localhost:3001",       // web frontend dev server
    "http://172.25.0.222:3001"     // optional local IP for web access
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routesclear
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", passwordRouter);
app.use("/api/members", memberRoutes);
app.use("/api/bookings", bookingRouter);
app.use("/api/contracts", contractRouter);
app.use("/api/activities", activityRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));



app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

export default app;
