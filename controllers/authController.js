const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const createAndSendToken = (user, statusCode, res) => {};

exports.register = async (req, res) => {
  //! 1. New User signsup
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.email, 8),
  });

  //! 2. Function call to send JWT Token
  createAndSendToken(newUser, 201, res);
};

// Controllers which deals with application logic for user.
