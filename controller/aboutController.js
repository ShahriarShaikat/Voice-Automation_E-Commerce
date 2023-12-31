// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// get login page
function getAboutPage(req, res) {
  res.render("about");
}

module.exports = {
  getAboutPage,
};
