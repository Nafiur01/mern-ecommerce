const createError = require("http-errors");
const users = require("../models/userModel");

const getUsers = (req, res, next) => {
  try {
    console.log(req.body.id);
    res.status(200).send({
      message: "Users Info were returned",
      users: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers };
