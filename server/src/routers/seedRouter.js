const express = require("express");
const { seedUser } = require("../controllers/seedController");
const seedRouter = express.Router();

// GET
seedRouter.get("/users", seedUser);

module.exports = seedRouter;
