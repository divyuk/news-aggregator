const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //converting error object into .array
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(",");
    return next(new AppError(errorMessage, 422));
  }
  next();
};

module.exports = handleValidation;
