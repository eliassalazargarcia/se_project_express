// Import the ClothingItem model
const ClothingItem = require("../models/clothingItem");
// Import custom error classes
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");

// Controller to get all clothing items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

// Controller to create a new clothing item
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  // Get the owner ID from the authenticated user (added by middleware)
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      // Check if error is due to validation failure
      if (err.name === "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

// Controller to delete a clothing item by ID
// Only the owner of an item can delete it
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  // First, find the item to check if it exists and who owns it
  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // Check if the current user is the owner of this item
      if (item.owner.toString() !== req.user._id) {
        throw new ForbiddenError("You don't have permission to delete this item");
      }

      // User is the owner - proceed with deletion
      return ClothingItem.findByIdAndDelete(itemId).orFail();
    })
    .then((deletedItem) => res.status(200).send(deletedItem))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found with the specified ID"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

// Controller to like an item (add user ID to likes array)
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found with the specified ID"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
    });
};

// Controller to unlike an item (remove user ID from likes array)
const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Item not found with the specified ID"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID"));
      }
      return next(err);
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
