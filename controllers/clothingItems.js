// Import the ClothingItem model
const ClothingItem = require("../models/clothingItem");
// Import error status codes
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

// Controller to get all clothing items
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      // Return 500 error for any server issues
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to create a new clothing item
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  // Get the owner ID from the authenticated user (added by middleware)
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
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

// Controller to delete a clothing item by ID
const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail() // Throw error if item not found
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      // Check if error is because document was not found
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Item not found with the specified ID" });
      }
      // Check if error is due to invalid ID format
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      // Default to 500 error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to like an item (add user ID to likes array)
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // Add _id to array if not already present
    { new: true }, // Return the updated document
  )
    .orFail() // Throw error if item not found
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      // Check if error is because document was not found
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Item not found with the specified ID" });
      }
      // Check if error is due to invalid ID format
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      // Default to 500 error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Controller to unlike an item (remove user ID from likes array)
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // Remove _id from array
    { new: true }, // Return the updated document
  )
    .orFail() // Throw error if item not found
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      // Check if error is because document was not found
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Item not found with the specified ID" });
      }
      // Check if error is due to invalid ID format
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID" });
      }
      // Default to 500 error
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};

// Export all controller functions
module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
