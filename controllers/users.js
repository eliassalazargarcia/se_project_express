// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");
// Import jsonwebtoken for creating tokens
const jwt = require("jsonwebtoken");
// Import the User model
const User = require("../models/user");
// Import JWT secret from config
const { JWT_SECRET } = require("../utils/config");
// Import error status codes
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Controller to create a new user (signup)
const createUser = (req, res) => {
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
      console.error(err);
      // Check if error is due to duplicate email (MongoDB error code 11000)
      if (err.code === 11000) {
        return res
          .status(CONFLICT)
          .send({ message: "A user with this email already exists" });
      }
      // Check if error is due to validation failure
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      // Default to 500 error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller for user login
const login = (req, res) => {
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
    .catch((err) => {
      console.error(err);
      // Return 401 for incorrect email or password
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Incorrect email or password" });
    });
};

// Controller to get the current logged-in user
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to update the current user's profile (name and avatar only)
const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true } // Return updated doc and run validators
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid user ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Export all controller functions
module.exports = { createUser, login, getCurrentUser, updateUser };
