const express = require("express");
const userRouter = require("./routes/userRoutes");
const app = express();

// Mounting the Router | userRouter is middleware
app.use("./api/v1/users", userRouter);

module.exports = app;
