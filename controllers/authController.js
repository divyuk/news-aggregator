// Controllers which deals with application logic for user.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsyn");

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

  //! 4. Save the token in the user model
  user.token = token; // Set the token in the user model
  user.save(); // Save the user model with the updated token field

  res.status(statusCode).send({ status: "success", token, data: { user } });
};

exports.register = catchAsync(async (req, res, next) => {
  //! 1.  Check if there is already a User with the given email or not
  const doc = await User.find({ email: req.body.email });
  if (doc.length > 0)
    return next(new AppError("This email ID is already registered", 409));

  //! 1a. Check if there is username is taken or not
  const docUsername = await User.find({ username: req.body.username });
  if (docUsername.length > 0)
    return next(new AppError("This username is taken", 409));

  //! 2. New User signsup
  const newUser = await User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    name: req.body.name,
    username: req.body.username,
  });

  //! 3. Function call to send JWT Token
  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  // password = bcrypt.hashSync(req.body.password, 8);
  //! 1. Check if there is email and password provided or not
  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));

  //! 2. Find email from the db and check its correctness
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401)); // Unauthorize

  //! 3. If eveything is ok send the token to client
  createAndSendToken(user, 200, res);
});

exports.logout = catchAsync(async (req, res, next) => {
  // await User.findByIdAndUpdate(
  //   req.user,
  //   {
  //     $set: {
  //       token: undefined,
  //     },
  //   },
  //   { new: true }
  // );

  const user = await User.findById(req.user);
  user.token = undefined;
  await user.save();
  // const options = {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  // };

  return res.status(200).send({ status: "User logged out" });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //! 1. Get token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  //! 2. Check Token
  if (!token)
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );

  //! 3. Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //! 4. Check if User still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(AppError("user belonging to this user does not exist", 401));
  req.user = currentUser;
  next();
});
