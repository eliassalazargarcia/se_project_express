// Import Express router
const router = require("express").Router();
// Import error status code
const { NOT_FOUND } = require("../utils/errors");

// Import route modules
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// Mount the user routes at /users
router.use("/users", userRouter);

// Mount the clothing item routes at /items
router.use("/items", clothingItemRouter);

// Handle requests to non-existent resources (404 Not Found)
router.use((_req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Export the main router
module.exports = router;
