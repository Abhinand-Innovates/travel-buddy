// Load environment variables FIRST
import dotenv from "dotenv";
dotenv.config();

// Core imports
import express from "express";
import connectDB from "./config/db.js";

// App initialization
const app = express();

// Middleware
app.use(express.json());

// Environment variables
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Health check route
app.get("/", (req, res) => {
  res.send("Travel Buddy API is running 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
