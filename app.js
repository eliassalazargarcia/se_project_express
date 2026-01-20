// ============================================
// WTWR (What To Wear?) Backend API Server
// ============================================
// This is the main entry point for the backend server
// It handles clothing items and user authentication

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Allows frontend to make requests to this backend
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

// Create Express application
const app = express();

// Set port from environment variable or default to 3001
const { PORT = 3001 } = process.env;

// ============================================
// DATABASE CONNECTION
// ============================================
// Connect to MongoDB database (local development)
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("✅ Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

// ============================================
// MIDDLEWARE SETUP
// ============================================

// 1. Enable CORS - allows frontend from different domain to access this API
app.use(cors());

// 2. Parse incoming JSON request bodies
app.use(express.json());

// ============================================
// ROUTES
// ============================================
// Mount all application routes (includes auth and protected routes)
app.use("/", mainRouter);

// ============================================
// ERROR HANDLING
// ============================================
// Central error handler - catches all errors from routes/controllers
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Access the API at: http://localhost:${PORT}`);
});
