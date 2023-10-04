const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createAndSendToken = (user, statusCode, res) => {
  //! 1. Create the JWT token
  const token = signToken(user._id);

  //! 2. Creating cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };
  //! 3. Setting Cookie - cookiename | data | options
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).send({ status: "success", token, data: { user } });
};

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
