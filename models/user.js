// Import mongoose for database schemas and models
const mongoose = require("mongoose");
// Import validator for URL and email validation
const validator = require("validator");
// Import bcrypt for password hashing
const bcrypt = require("bcryptjs");

// Define the user schema with all required fields for authentication
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, // Minimum 2 characters for name
    maxlength: 30, // Maximum 30 characters for name
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value); // Validate that avatar is a valid URL
      },
      message: "You must enter a valid URL",
    },
  },
  // EMAIL FIELD - Required for user authentication
  email: {
    type: String,
    required: [true, "Email is required"], // Email must be provided
    unique: true, // Each email can only be used once (no duplicate accounts)
    validate: {
      validator(value) {
        return validator.isEmail(value); // Validate email format using validator package
      },
      message: "You must enter a valid email address",
    },
  },
  // PASSWORD FIELD - Stored as a hash for security
  password: {
    type: String,
    required: [true, "Password is required"], // Password must be provided
    select: false, // 🔒 IMPORTANT: This hides the password from query results for security
  },
});

// CUSTOM METHOD: Find user by email and password credentials
// This is used during login to verify if the user's credentials are correct
userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  // Step 1: Find user by email AND include the password field (normally hidden)
  return this.findOne({ email })
    .select("+password") // The "+" prefix includes the password even though select: false is set
    .then((user) => {
      // Step 2: Check if user exists
      if (!user) {
        // If no user found with this email, reject with error
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // Step 3: Compare the provided password with the hashed password in database
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // If passwords don't match, reject with error
          return Promise.reject(new Error("Incorrect email or password"));
        }

        // Step 4: If everything is correct, return the user object
        return user;
      });
    });
};

// Export the user model
module.exports = mongoose.model("user", userSchema);
