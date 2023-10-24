const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const newsRouter = require("./routes/newsRoutes");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
// Middleware for parsing json.
app.use(express.json());
const corsOptions = {
  origin: "https://one-news.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // specified here
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
express.urlencoded({ extended: false });

dotenv.config({ path: "./config.env" });

//? Database Connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
if (process.env.NODE_ENV != "test") {
  mongoose
    .connect(DB)
    .then(() => console.log("Successfully DB connected"))
    .catch((err) => console.log("Problem in connecting Database", err));
}
// Mounting the Router | userRouter is middleware
app.use("/api/v1/users", userRouter);

app.use("/api/v1/news", newsRouter);

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;

// This file has Router Mounted and Database Connection
