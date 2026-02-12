// import express, { Application, Request, Response } from "express";
// import { connectDatabase } from "./database/mongodb";
// import authRouter from "./routes/auth.route";
// import userRouter from "./routes/user.routes";
// import adminRouter from "./routes/admin.route";
// import { PORT } from "./config";
// import cors from "cors";
// import path from "path";
// import cookieParser from "cookie-parser";
// import passwordRouter from "./routes/password.route";

// const app: Application = express();

// //  Allow cookies and restrict origin to your frontend
// app.use(cors({
//   origin: "http://localhost:3001", // your Next.js frontend port
//   credentials: true,
// }));

// //  Parse cookies so we can read JWT
// app.use(cookieParser());

// //  Parse JSON and form data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routers
// app.use("/api/auth", authRouter);
// app.use("/api/users", userRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/auth", passwordRouter);

// // Serve uploaded files
// app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// // Root route
// app.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({ success: true, message: "Welcome to the API" });
// });

// // Connect DB and start server
// // connectDatabase();

// // app.listen(Number(PORT), () => {
// //   console.log(`Server running at http://localhost:${PORT}`);
// // });

// export default app;


import express, { Application, Request, Response } from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.route";
import passwordRouter from "./routes/password.route";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import bookingRouter from "./routes/booking.route";
import activityRouter from "./routes/activity.route";

const app: Application = express();

// app.use(cors({
//   origin:[ "http://localhost:3001",
//   "http://172.25.0.222:3001"
//   ],
//   credentials: true,
// }));

app.use(cors({
  origin: true,
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", passwordRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/activities", activityRouter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

export default app;
