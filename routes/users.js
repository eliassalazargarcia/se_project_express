// Import Express router
const router = require("express").Router();
// Import user controller functions
const { getUsers, createUser, getUser } = require("../controllers/users");

// GET /users - Get all users
router.get("/", getUsers);

// GET /users/:userId - Get a specific user by ID
router.get("/:userId", getUser);

// POST /users - Create a new user
router.post("/", createUser);

// Export the router
module.exports = router;
