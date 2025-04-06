require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;
const mongodbURL =
  process.env.MONGODB_URL || "mongodb://localhost:27017/mern-ecommerce";
const defaultImagePath =
  process.env.DEFAULT_IMAGE_PATH || "public/images/users/default-user.png";
const jwtActivationKey =
  process.env.JWT_ACTIVATION_KEY || "dsadjhajfj664348ksmnt";

const smtpUsername = process.env.SMTP_USERNAME || "";
const smtpPassword = process.env.SMTP_PASSWORD || "";
const clientUrl = process.env.CLIENT_URL || "";
const uploadDir = process.env.UPLOAD_FILE || "public/images/users";

module.exports = {
  serverPort,
  mongodbURL,
  defaultImagePath,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientUrl,
  uploadDir,
};
