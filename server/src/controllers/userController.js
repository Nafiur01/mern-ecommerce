const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel");
const fs = require("fs").promises;
const { successResponse } = require("./responseController");
const mongoose = require("mongoose");
const findWithId = require("../services/findItem");
const deleteImage = require("../helper/deleteImage");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientUrl } = require("../secret");
const emailWithNodemailer = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const searchRegExp = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegExp } },
        { email: { $regex: searchRegExp } },
        { phone: { $regex: searchRegExp } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) {
      throw createError(404, "no users found");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "users were return successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "users were return successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);
    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "users was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const image = req.file;
    if (!image) {
      throw createError(400, "Image file is required");
    }
    if (image.size > 1024 * 1024 * 2) {
      throw createError(
        400,
        "File is too large. File size must be less than 2 Mb"
      );
    }

    const imageBufferString = image.buffer.toString("base64");

    const userExists = await User.exists({ email: email });

    if (userExists) {
      throw createError(409, "user with this email already exists");
    }

    // Jwt Token
    const token = createJsonWebToken(
      { name, email, password, address, phone, image: imageBufferString },
      jwtActivationKey,
      "10m"
    );

    // prepare email
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2> Hello ${name} ! </h2>
        <p> Please click here to <a href="${clientUrl}/api/users/activate/${token}" target='_blank' > activate your account </a> </p>
      `,
    };

    try {
      // send email with nodemailer
      await emailWithNodemailer(emailData);
    } catch (emailError) {
      console.error(emailError);
      next(createError(500, "Error occured while sending verification email"));
      return;
    }

    return successResponse(res, {
      statusCode: 200,
      message: `Please go to ${email} to complete registration process`,
      payload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "Token not found");
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!decoded) throw createError(401, "Unable to verify the user");

      const userExists = await User.exists({ email: decoded.email });

      if (userExists) {
        throw createError(409, "user with this email already exists");
      }
      await User.create(decoded);
      return successResponse(res, {
        statusCode: 201,
        message: `User was registered successfully`,
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token is expired");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const options = { password: 0 };
    await findWithId(User, userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};
    // name,email,password,phone,image,address

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw new Error("Email can not be updated");
      }
    }

    const image = req.file;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "File is too large. File size must be less than 2 Mb"
        );
      }
      updates.image = image.buffer.toString("base64");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User not found by the provided id");
    }

    return successResponse(res, {
      statusCode: 200,
      message: "users was updated successfully",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
  updateUserById,
};
