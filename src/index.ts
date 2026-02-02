import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.route"; // new admin router
import { PORT } from "./config";
import cors from "cors";
import path from "path";

const app: Application = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter); // register admin routes

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

connectDatabase();

app.listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
  //console.log(`Server running at http://192.168.1.1:${PORT}`);
});

export default app;
