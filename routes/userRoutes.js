const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const { validateRegister } = require("../helpers/validate");
const handleValidation = require("../middlewares/validateMiddleware");
const router = express.Router();

router.post(
  "/register",
  validateRegister,
  handleValidation,
  authController.register
);
router.post("/login", authController.login);

// Apply the protect middleware for the below routes
router.use(authController.protect);

router.get("/preferences", userController.preferences);
router.put("/preferences", userController.updatePreferences);

router.put("/newspreferences", userController.updateNewsPreferences);

module.exports = router;

// This file has the Routes defined for user
