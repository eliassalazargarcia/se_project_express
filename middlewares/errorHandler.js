// Central Error Handling Middleware
// This catches any errors that weren't handled by controllers
// and sends a consistent error response to the client

const { INTERNAL_SERVER_ERROR } = require("../utils/errors");

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Get status code from error or default to 500
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;

  // Get error message or use a generic message
  const message = err.message || "An error occurred on the server";

  // Log the error for debugging
  console.error("Error:", err);

  // Send error response to client
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
