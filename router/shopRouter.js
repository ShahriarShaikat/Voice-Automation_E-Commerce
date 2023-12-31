// external imports
const express = require("express");

// internal imports
const { getShopPage } = require("../controller/shopController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");

const router = express.Router();

// set page title
const page_title = "Shop";

// home page
router.get("/", decorateHtmlResponse(page_title), getShopPage);

module.exports = router;
