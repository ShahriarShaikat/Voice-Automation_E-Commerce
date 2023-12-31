// external imports
const express = require("express");

// internal imports
const {
  login,
  getRegisterPage,
  addUser,
} = require("../controller/accountController.js");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse.js");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middlewares/login/loginValidator.js");
const { redirectLoggedIn } = require("../middlewares/common/checkLogin.js");
const {
  addUserValidators,
  addUserValidationHandler,
} = require("../middlewares/users/userValidators.js");

const router = express.Router();

// set page title
const page_title = "Register";

// home page + login page
router.get(
  "/",
  redirectLoggedIn,
  decorateHtmlResponse(page_title),
  getRegisterPage
);

// process login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidators,
  doLoginValidationHandler,
  login
);

// user registration process
router.post(
  "/registration",
  decorateHtmlResponse(page_title),
  addUserValidators,
  addUserValidationHandler,
  addUser
);

module.exports = router;
