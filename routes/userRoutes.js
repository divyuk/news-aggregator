const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", authController.register);
router.get("/login", authController.login);

router.get("/preferences", userController.preferences);

module.exports = router;

// This file has the Routes defined for user
