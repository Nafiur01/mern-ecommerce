const { body } = require("express-validator");
// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required. Enter your full name.")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be atleast 3-31 characters long"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required. Enter your email address.")
    .isEmail()
    .withMessage("Invalid email address"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required. Enter your password")
    .isLength({ min: 6 })
    .withMessage("Password should be atleast 6 characters long")
    .matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/)
    .withMessage(
      "Password should contain atleast one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required. Enter your address")
    .isLength({ min: 3 })
    .withMessage("Address should be atleast 3 characters long"),
  body("phone")
    .trim()
    .notEmpty()
    .withMessage("Phone is required. Enter your phone number."),
  body("image").optional().isString().withMessage("image is required"),
];
// sign in validation

module.exports = { validateUserRegistration };
