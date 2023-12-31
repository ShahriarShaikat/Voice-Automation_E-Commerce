// external imports
const express = require("express");

// internal imports
const { getContactPage } = require("../controller/contactController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");

const router = express.Router();

// set page title
const page_title = "Contact";

// home page
router.get("/", decorateHtmlResponse(page_title), getContactPage);

module.exports = router;
