// import app from "./index";
// import { PORT } from "./config";
// import { connectDatabase } from "./database/mongodb";

// connectDatabase();

// app.listen(Number(PORT), "0.0.0.0", () => {
//   console.log(`Server running at http://localhost:${PORT}`);
//   console.log(`Server also available on your local IP (e.g., http://172.25.0.222:${PORT})`);
// });



import app from "./index";
import { PORT } from "./config";
import { connectDatabase } from "./database/mongodb";
import { Server } from "socket.io";
import { registerChatHandlers } from "./sockets/chat.socket";

connectDatabase();

// Create HTTP server from Express app
const httpServer = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(
    `Server also available on your local IP (e.g., http://172.25.0.222:${PORT})`
  );
});

// Attach Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3001",       // web frontend dev server
      "http://172.25.0.222:3001"     // optional local IP for web access
    ],
    credentials: true,
  },
});

// Register chat socket handlers
registerChatHandlers(io);
