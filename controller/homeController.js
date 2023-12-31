// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const Product = require("../models/Product");

// get login page
async function getHomePage(req, res) {
  try {
    const featuredProduct = await Product.find({
      featured: true,
    }).sort("-createdAt");
    const newProduct = await Product.find().sort("-createdAt").limit(8);
    res.render("home", { featuredProduct, newProduct });
  } catch (err) {
    res.render("home", { featuredProduct: [], newProduct: [] });
  }
}

module.exports = {
  getHomePage,
};
