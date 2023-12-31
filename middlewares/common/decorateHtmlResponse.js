const jwt = require("jsonwebtoken");

function decorateHtmlResponse(page_title) {
  return function (req, res, next) {
    res.locals.html = true;
    res.locals.title = `${page_title} - ${process.env.APP_NAME}`;
    res.locals.link = page_title.toLowerCase();

    res.locals.errors = {};
    res.locals.data = {};

    let cookies =
      Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

    if (cookies) {
      try {
        token = cookies[process.env.COOKIE_NAME];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        res.locals.loggedInUser = decoded;
      } catch (err) {
        res.locals.loggedInUser = {};
      }
    } else {
      res.locals.loggedInUser = {};
    }
    next();
  };
}

module.exports = decorateHtmlResponse;
