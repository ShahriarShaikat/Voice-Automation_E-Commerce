// external imports
const express = require("express");

// internal imports
const { getAboutPage } = require("../controller/aboutController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");

const router = express.Router();

// set page title
const page_title = "About";

// home page
router.get("/", decorateHtmlResponse(page_title), getAboutPage);

module.exports = router;
