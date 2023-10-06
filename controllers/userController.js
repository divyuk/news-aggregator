const User = require("../models/userModel");
const catchAsyn = require("../utils/catchAsyn");

exports.preferences = catchAsyn(async (req, res, next) => {
  const { category, sources, country } = await User.findById(req.user);
  res
    .status(200)
    .json({ status: "success", data: { category, sources, country } });
});
