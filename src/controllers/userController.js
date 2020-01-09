const userQueries = require("../db/queries.users.js");

module.exports = {
  signUp(req, res, next) {
    res.render("users/signup");
  },
  create(req, res, next) {
    var newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.password_conf
    };
    userQueries.createUser(newUser, function(err, user) {
      if (err) {
        // req.flash("error", err)
        res.redirect("/users/sign_up");
      } else {
        res.redirect("/");
      }
    });
  }
};
