const mongoose = require("mongoose");
const { User } = require("../models/userModel");
const createError = require("http-errors");

const findWithId = async (Model, id, options = {}) => {
  try {
    const item = await Model.findById(id, options);
    if (!item) {
      throw createError(404, `${Model.modelName} does not exist with this id`);
    }
    return item;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(404, "user id is invalid");
    }
    throw error;
  }
};

module.exports = findWithId;
