// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

// Create Express application
const app = express();
// Set port from environment variable or default to 3001
const { PORT = 3001 } = process.env;

// Connect to MongoDB database
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.error("Connected to DB");
  })
  .catch(console.error);

// Parse JSON request bodies
app.use(express.json());

// Temporary authorization middleware (will be replaced with real auth later)
// This adds a hardcoded user object to every request for testing purposes
app.use((req, _res, next) => {
  req.user = {
    _id: "696ed44dc65999ed14fbd784", // Test user ID from database
  };
  next(); // Pass control to the next middleware
});

// Mount all routes
app.use("/", mainRouter);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.error(`App listening at port ${PORT}`);
});
