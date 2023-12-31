// external imports
const express = require("express");

// internal imports
const { getBlogPage } = require("../controller/blogController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");

const router = express.Router();

// set page title
const page_title = "Blog";

// home page
router.get("/", decorateHtmlResponse(page_title), getBlogPage);

module.exports = router;
