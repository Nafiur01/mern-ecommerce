require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mern-ecommerce";
const defaultImagePath =
  process.env.DEFAULT_IMAGE_PATH || "public/images/users/default-user.png";
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "dsadjhajfj664348ksmnt";

module.exports = { serverPort, mongodbURL, defaultImagePath, jwtActivationKey };
