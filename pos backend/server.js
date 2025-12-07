// server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import apiRoutes from "./routes/index.js";
import path from "path";

dotenv.config();

const app = express();

// serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// middleware
app.use(cors()); // allow frontend to call backend (adjust origin in production)
app.use(express.json()); // parse JSON body

// basic healthcheck
app.get("/", (req, res) => res.send("API is running"));

// mount API routes under /api
app.use("/api", apiRoutes);

// start DB then server
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
