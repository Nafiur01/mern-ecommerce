const { User } = require("../models/userModel");
const data = require("../data");

const seedUser = async (req, res, next) => {
  try {
    // deleting existing users first
    await User.deleteMany({});
    // inserting new users
    const user = await User.insertMany(data.user);
    // successful response
    return res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUser };
