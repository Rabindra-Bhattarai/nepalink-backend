import app from "./index";
import { PORT } from "./config";
import { connectDatabase } from "./database/mongodb";
import { Server } from "socket.io";
import { registerChatHandlers } from "./sockets/chat.socket";

connectDatabase();

// Create HTTP server from Express app
const httpServer = app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Server also available on your local IP (http://10.221.76.214:${PORT})`);
});

// Attach Socket.IO with multi-origin CORS
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3001",       // web frontend dev server
      "http://10.221.76.214:3001",         // local IP for web
      "http://10.238.15.214:3000"     // physical device hitting API directly
    ],
    credentials: true,
  },
});

// Register chat socket handlers
registerChatHandlers(io);
