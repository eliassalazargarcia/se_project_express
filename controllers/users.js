// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");
// Import jsonwebtoken for creating tokens
const jwt = require("jsonwebtoken");
// Import the User model
const User = require("../models/user");
// Import JWT secret from config
const { JWT_SECRET } = require("../utils/config");
// Import custom error classes
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors");

// Controller to create a new user (signup)
const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  // Hash the password before saving to database
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      // Return user data without the password
      const userResponse = user.toObject();
      delete userResponse.password;
      res.status(201).send(userResponse);
    })
    .catch((err) => {
      // Check if error is due to duplicate email (MongoDB error code 11000)
      if (err.code === 11000) {
        return next(new ConflictError("A user with this email already exists"));
      }
      // Check if error is due to validation failure
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      // Pass other errors to centralized error handler
      return next(err);
    });
};

// Controller for user login
const login = (req, res, next) => {
  const { email, password } = req.body;

  // Use the custom method to find user by credentials
  User.findUserByCredentials(email, password)
    .then((user) => {
      // Create JWT token that expires in 7 days
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      // Send token to client
      res.send({ token });
    })
    .catch(() => {
      // Return 401 for incorrect email or password
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

// Controller to get the current logged-in user
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

// Controller to update the current user's profile (name and avatar only)
const updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("User not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID"));
      }
      return next(err);
    });
};

// Export all controller functions
module.exports = { createUser, login, getCurrentUser, updateUser };
