// external imports
const express = require("express");

// internal imports
const {
  increaseDecreaseCartQTY,
  makeCartEmpty,
  removeProductFromCart,
  getCartDetails,
  getCartPage,
  addToCart,
  getCartCount,
  getProductDetails,
} = require("../controller/cartController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");
const { checkLogin } = require("../middlewares/common/checkLogin.js");

const router = express.Router();

// set page title
const page_title = "Cart";

// cart page
router.get("/", decorateHtmlResponse(page_title), getCartPage);

// add to cart
router.get("/add-to-cart/:id", checkLogin, addToCart);

// get cart count
router.get("/count", checkLogin, getCartCount);

// get cart details
router.get("/get-details", checkLogin, getCartDetails);

// remove product from cart
router.get("/remove/:product_id", checkLogin, removeProductFromCart);

// increase or decrease cart quantity
router.get("/quantity/:id/:qty", checkLogin, increaseDecreaseCartQTY);

// make cart empty
router.get("/empty", checkLogin, makeCartEmpty);

// get a product details
router.get("/product/:product_name", checkLogin, getProductDetails);

module.exports = router;
