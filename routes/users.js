// Import Express router
const router = require("express").Router();
// Import user controller functions
const { getCurrentUser, updateUser } = require("../controllers/users");

// GET /users/me - Get the current logged-in user's profile
router.get("/me", getCurrentUser);

// PATCH /users/me - Update the current user's profile (name and avatar only)
router.patch("/me", updateUser);

// Export the router
module.exports = router;
