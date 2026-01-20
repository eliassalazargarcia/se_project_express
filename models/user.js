// Import mongoose for database schemas and models
const mongoose = require("mongoose");
// Import validator for URL validation
const validator = require("validator");

// Define the user schema with name and avatar fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2, // Fixed typo: was "minlenght"
    maxlength: 30, // Fixed typo: was "maxlenght"
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value); // Fixed: removed extra space
      },
      message: "You must enter a valid URL",
    },
  },
});

// Export the user model
module.exports = mongoose.model("user", userSchema);
