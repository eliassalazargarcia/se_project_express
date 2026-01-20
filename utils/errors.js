// HTTP status codes for error handling
// These constants are used throughout the application to maintain consistency

// 400 - Bad Request: Invalid data passed to methods or invalid ID
const BAD_REQUEST = 400;

// 403 - Forbidden: User doesn't have permission to perform this action
const FORBIDDEN = 403;

// 404 - Not Found: Resource with requested ID doesn't exist
const NOT_FOUND = 404;

// 500 - Internal Server Error: Default error for server issues
const INTERNAL_SERVER_ERROR = 500;

// Export all error codes for use in controllers
module.exports = {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
};
