import dotenv from "dotenv";
// Load environment variables FIRST before any other imports
dotenv.config();

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 ShareReads API ready`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
