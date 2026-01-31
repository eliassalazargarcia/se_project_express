// Import Express router
const router = require("express").Router();
// Import all clothing item controllers
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
// Import validation middleware
const { validateItemBody, validateItemId } = require("../middlewares/validation");

// GET /items - Get all clothing items
router.get("/", getItems);

// POST /items - Create a new clothing item
router.post("/", validateItemBody, createItem);

// DELETE /items/:itemId - Delete a clothing item by ID
router.delete("/:itemId", validateItemId, deleteItem);

// PUT /items/:itemId/likes - Like an item
router.put("/:itemId/likes", validateItemId, likeItem);

// DELETE /items/:itemId/likes - Unlike an item
router.delete("/:itemId/likes", validateItemId, dislikeItem);

// Export the router
module.exports = router;
