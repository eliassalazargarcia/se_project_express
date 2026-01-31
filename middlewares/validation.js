const { celebrate, Joi } = require("celebrate");
const validator = require("validator");

// Custom validator for URLs
const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// Validation for user signup
const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the name field is 2",
      "string.max": "The maximum length of the name field is 30",
      "string.empty": "The name field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The avatar field is required",
      "string.uri": "The avatar field must be a valid URL",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The email field is required",
      "string.email": "The email field must be a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field is required",
    }),
  }),
});

// Validation for user login
const validateUserLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The email field is required",
      "string.email": "The email field must be a valid email",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The password field is required",
    }),
  }),
});

// Validation for creating a clothing item
const validateItemBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the name field is 2",
      "string.max": "The maximum length of the name field is 30",
      "string.empty": "The name field is required",
    }),
    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "string.empty": "The weather field is required",
      "any.only": "The weather field must be hot, warm, or cold",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The imageUrl field is required",
      "string.uri": "The imageUrl field must be a valid URL",
    }),
  }),
});

// Validation for item ID in params
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": "The itemId is required",
      "string.hex": "The itemId must be a valid hexadecimal",
      "string.length": "The itemId must be 24 characters long",
    }),
  }),
});

// Validation for updating user profile
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of the name field is 2",
      "string.max": "The maximum length of the name field is 30",
      "string.empty": "The name field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The avatar field is required",
      "string.uri": "The avatar field must be a valid URL",
    }),
  }),
});

module.exports = {
  validateUserBody,
  validateUserLogin,
  validateItemBody,
  validateItemId,
  validateUserUpdate,
};
