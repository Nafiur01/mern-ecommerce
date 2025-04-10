const mongoose = require("mongoose");
const { mongodbURL } = require("../secret");

const connectDB = async (options = {}) => {
  try {
    await mongoose.connect(mongodbURL, options);
    console.log("Connection Successfully Established!");

    mongoose.connection.on("error", (error) => {
      console.log("DB Connection error: ", error);
    });
  } catch (error) {
    console.log("Could not connect to DB ", error.toString());
  }
};

module.exports = connectDB;
