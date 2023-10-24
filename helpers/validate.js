const { check } = require("express-validator");

const usernameRegex = /^[A-Za-z0-9._]*$/;

const validateRegister = [
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email ID passed"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  check("name")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Name must not be empty and should be a string"),
  check("username")
    .isString()
    .not()
    .isEmpty()
    .withMessage("Username must not be empty and should be a string")
    .matches(usernameRegex)
    .withMessage(
      "Username can only contain letters, numbers, underscores, and periods"
    ),
];

const validateLogin = [
  check("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Invalid Email ID passed"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

module.exports = {
  validateRegister,
  validateLogin,
};
