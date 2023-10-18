const { check } = require("express-validator");

const validateRegister = [
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
};
