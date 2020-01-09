require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const logger = require("morgan");
let flash = require("express-flash");
const expressValidator = require("express-validator");
const passportConfig = require('./passport-config.js')
const session = require("express-session");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets")));
app.use(session({
  secret: process.env.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {maxAge: 1.21e+9}
}))
app.use(flash());

passportConfig.init(app)
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next()
})
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    app.use(logger("dev"));
  }
};
