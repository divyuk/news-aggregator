const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.register);
router.get("/login", authController.login);

module.exports = router;

// This file has the Routes defined for user
