// external imports
const express = require("express");

// internal imports
const { getHomePage } = require("../controller/homeController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");

const router = express.Router();

// set page title
const page_title = "Home";

// home page
router.get("/", decorateHtmlResponse(page_title), getHomePage);

module.exports = router;
