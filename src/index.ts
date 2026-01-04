import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import { PORT } from "./config";
import authRoutes from "./routes/auth.route";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Server: http://localhost:${PORT}`);
  });
}

startServer();
