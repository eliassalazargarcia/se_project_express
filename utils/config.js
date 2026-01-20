// Configuration settings for the application
// ⚠️ SECURITY NOTE: In production, JWT_SECRET should be stored in environment variables
// For development, we use a fallback value

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-production";

module.exports = {
  JWT_SECRET,
};
