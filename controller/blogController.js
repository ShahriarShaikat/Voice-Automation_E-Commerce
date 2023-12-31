// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// get login page
function getBlogPage(req, res) {
  res.render("blog");
}

module.exports = {
  getBlogPage,
};
