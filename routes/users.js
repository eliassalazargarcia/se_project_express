// Import Express router
const router = require("express").Router();
// Import user controller functions
const { getCurrentUser, updateUser } = require("../controllers/users");
// Import validation middleware
const { validateUserUpdate } = require("../middlewares/validation");

// GET /users/me - Get the current logged-in user's profile
router.get("/me", getCurrentUser);

// PATCH /users/me - Update the current user's profile (name and avatar only)
router.patch("/me", validateUserUpdate, updateUser);

// Export the router
module.exports = router;
