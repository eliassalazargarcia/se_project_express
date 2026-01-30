// ============================================
// WTWR (What To Wear?) Backend API Server
// ============================================
// This is the main entry point for the backend server
// It handles clothing items and user authentication

require("dotenv").config();

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// ============================================
// MIDDLEWARE SETUP
// ============================================

// 1. Enable CORS - allows frontend from different domain to access this API
app.use(cors());

// 2. Parse incoming JSON request bodies
app.use(express.json());

// 3. Request logger - logs all requests to request.log
app.use(requestLogger);

// ============================================
// CRASH TEST ROUTE (for PM2 testing)
// ============================================
// This route is used to test server crash recovery
// Remove after passing the code review
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ============================================
// ROUTES
// ============================================
// Mount all application routes (includes auth and protected routes)
app.use("/", mainRouter);

// ============================================
// ERROR HANDLING
// ============================================

// Error logger - logs all errors to error.log
app.use(errorLogger);

// Celebrate error handler - handles validation errors from celebrate/joi
app.use(errors());

// Central error handler - catches all errors from routes/controllers
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the API at: http://localhost:${PORT}`);
});
