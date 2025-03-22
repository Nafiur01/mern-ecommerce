const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const rateLimit = require("express-rate-limit");
const userRouter = require("../routers/userRouter");
const seedRouter = require("../routers/seedRouter");

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many requests from this IP. Please try again later.",
});

app.use(morgan("dev"));
app.use(rateLimiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users",userRouter);
app.use("/api/seed",seedRouter);

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "API testing is working fine",
  });
});

// client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// server error handling, first client then server -> all the errors
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
