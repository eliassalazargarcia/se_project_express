// Authorization Middleware
// Verifies JWT token from request headers and protects routes

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  // Get the Authorization header
  const { authorization } = req.headers;

  // Check if header exists and starts with "Bearer "
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Extract the token (remove "Bearer " prefix)
  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    // Verify the token using the secret key
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // If verification fails, return 401 error
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  // Add the payload (user _id) to the request object
  req.user = payload;

  // Continue to the next middleware/controller
  return next();
};

module.exports = auth;
