// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");

/*------------------------------ internal imports ------------------------------*/
const accountRouter = require("./router/accountRouter.js");
const homeRouter = require("./router/homeRouter.js");
const aboutRouter = require("./router/aboutRouter.js");
const blogRouter = require("./router/blogRouter.js");
const cartRouter = require("./router/cartRouter.js");
const contactRouter = require("./router/contactRouter.js");
const shopRouter = require("./router/shopRouter.js");

const DB = require("./db/Connections");
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler.js");

/*--------------------------- End- internal imports ---------------------------*/

const app = express();
const server = http.createServer(app);
dotenv.config();

// socket creation
//const io = require("socket.io")(server);
//global.io = io;

// database connection
DB();

// set comment as app locals
app.locals.moment = moment;

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/", accountRouter);
app.use("/home", homeRouter);
app.use("/cart", cartRouter);
app.use("/shop", shopRouter);
app.use("/blog", blogRouter);
app.use("/about", aboutRouter);
app.use("/contact", contactRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

server.listen(process.env.APP_PORT, () => {
  console.log(`listening to port ${process.env.APP_PORT}`);
});
