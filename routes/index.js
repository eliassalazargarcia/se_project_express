// Import Express router
const router = require("express").Router();
// Import error status code
const { NOT_FOUND } = require("../utils/errors");
// Import auth middleware
const auth = require("../middlewares/auth");
// Import controllers for signin/signup
const { createUser, login } = require("../controllers/users");
// Import getItems controller for public access
const { getItems } = require("../controllers/clothingItems");

// Import route modules
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

// ============================================
// PUBLIC ROUTES (no authentication required)
// ============================================

// POST /signup - Create a new user account
router.post("/signup", createUser);

// POST /signin - Login and get a JWT token
router.post("/signin", login);

// GET /items - Get all clothing items (public access)
router.get("/items", getItems);

// ============================================
// PROTECTED ROUTES (authentication required)
// ============================================

// Apply auth middleware to all routes below
router.use(auth);

// Mount the user routes at /users (protected)
router.use("/users", userRouter);

// Mount the clothing item routes at /items (protected for POST, DELETE, PUT, PATCH)
router.use("/items", clothingItemRouter);

// Handle requests to non-existent resources (404 Not Found)
router.use((_req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

// Export the main router
module.exports = router;
