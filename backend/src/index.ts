import dotenv from "dotenv";
// Load environment variables FIRST before any other imports
dotenv.config();

import { createServer } from "http";
import app from "./app";
import { initializeSockets } from "./sockets";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
const io = initializeSockets(httpServer);

// Make io available on app for potential use in routes
app.set("io", io);

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 ShareReads API ready`);
  console.log(`🔌 Socket.io ready on /transaction namespace`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
