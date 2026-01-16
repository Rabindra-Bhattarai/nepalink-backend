import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import { PORT } from "./config";
import cors from "cors";

const app: Application = express();
let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5173"],
  //which domain can access your backend server
  //add frotend domain here
}
//origin : '*' //allow all domain to access your backend server
app.use(cors(corsOptions)); //implement cors middleware

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