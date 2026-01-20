// Import mongoose for database schemas and models
const mongoose = require("mongoose"); // Fixed typo: was "requiere"
// Import validator for URL validation
const validator = require("validator");

// Define the clothing item schema with all required fields
const clothingItemSchema = new mongoose.Schema({
  // Name of the clothing item
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  // Weather type for the clothing item (hot, warm, or cold)
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"], // Only these three values are allowed
  },
  // URL of the clothing item image
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  // Reference to the user who created this item
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  // Array of user IDs who liked this item
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    default: [], // Empty array by default
  },
  // Timestamp of when the item was created
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the clothing item model
module.exports = mongoose.model("item", clothingItemSchema);
