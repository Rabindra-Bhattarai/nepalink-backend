import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";   // ✅ user routes
import { PORT } from "./config";
import cors from "cors";
import path from "path";

const app: Application = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter); 

//  Serve uploaded files so Flutter can access them
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// Root route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

// Connect DB
connectDatabase();

// Start server
app.listen(Number(PORT), () => {
  console.log(`Server running at http://10.125.49.214:${PORT}`);
});

export default app;
