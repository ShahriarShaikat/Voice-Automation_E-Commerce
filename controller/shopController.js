// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const Product = require("../models/Product");

// get login page
async function getShopPage(req, res) {
  try {
    const products = await Product.find().sort("createdAt");
    res.render("shop", { products });
  } catch (err) {
    res.render("shop", { products: [] });
  }
}

module.exports = {
  getShopPage,
};
