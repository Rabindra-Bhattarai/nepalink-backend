import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.route";
import { PORT } from "./config";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

const app: Application = express();

//  Allow cookies and restrict origin to your frontend
app.use(cors({
  origin: "http://localhost:3001", // your Next.js frontend port
  credentials: true,
}));

//  Parse cookies so we can read JWT
app.use(cookieParser());

//  Parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Root route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

// Connect DB and start server
connectDatabase();

app.listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
