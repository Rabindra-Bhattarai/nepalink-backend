import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import { PORT } from "./config";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});


  connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
  });

export default app;