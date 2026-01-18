// import express, { Application, Request, Response } from "express";
// import { connectDatabase } from "./database/mongodb";
// import authRouter from "./routes/auth.route";
// // import { PORT } from "./config";
// import cors from "cors";

// const app: Application = express();
// let corsOptions = {
//   origin: ["http://localhost:3000", "http://localhost:5173", "http://192.168.1.4:3000"],
//   //which domain can access your backend server
//   //add frotend domain here
// }
// //origin : '*' //allow all domain to access your backend server
// app.use(cors(corsOptions)); //implement cors middleware

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use("/api/auth", authRouter);

// app.get("/", (req: Request, res: Response) => {
//   return res.status(200).json({ success: true, message: "Welcome to the API" });
// });


//   connectDatabase();

//   // app.listen(PORT, () => {
//   //   console.log(`Server: http://localhost:${PORT}`);
//   // });


//   const PORT = Number(process.env.PORT) || 3000;

//   app.listen(PORT, () => {
//     console.log(`Server running at http://192.168.1.4:${PORT}`);
//   });

// export default app;

import express, { Application, Request, Response } from "express";
import { connectDatabase } from "./database/mongodb";
import authRouter from "./routes/auth.route";
import { PORT } from "./config";
import cors from "cors";

const app: Application = express();

// For development, allow all origins
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRouter);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ success: true, message: "Welcome to the API" });
});

connectDatabase();

// Use the PORT from config (make sure it's a number)
// app.listen(Number(PORT), () => {
//   console.log(`Server running at http://192.168.1.4:${PORT}`);
// });

app.listen(Number(PORT), () => {
  console.log(`Server running at http://localhost:${PORT}`);
});





export default app;
