const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, require: [true, "Please tell your name"] },
  email: {
    type: String,
    require: [true, "Please tell the email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please write a valid Email"],
  },
  password: {
    type: String,
    require: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    requrie: [true, "Please confirm your password"],
    validate: {
      // This only works with Create and save!!!
      validator: function (incomingPassword) {
        return this.password === incomingPassword;
      },
      message: "Password are not the same",
    },
  },
});

// Create a Model out of the Schema
const User = mongoose.model("User", userSchema);

module.exports = User;
