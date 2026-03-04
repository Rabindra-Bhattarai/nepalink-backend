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
import chatRouter from "./routes/chat.routes";

const app: Application = express();

// Allow both web frontend and physical device (Flutter)
app.use(cors({
  origin: [
    "http://localhost:3001",        // web dev server
    "http://10.221.76.214:3001",     // local IP for web
    "http://10.221.76.214:3000"      // physical device hitting API directly
  ],
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", passwordRouter);
app.use("/api/members", memberRoutes);
app.use("/api/bookings", bookingRouter);
app.use("/api/contracts", contractRouter);
app.use("/api/activities", activityRouter);
app.use("/api/chat", chatRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

export default app;
