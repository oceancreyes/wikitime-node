require("dotenv").config();
const bodyParser = require("body-parser");
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const logger = require("morgan");
//let flash = require("express-flash");
const expressValidator = require("express-validator");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(express.static(path.join(__dirname, "..", "assets")));

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(expressValidator());
    //app.use(flash());
    app.use(logger("dev"));
  }
};
