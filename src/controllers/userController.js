const userQueries = require("../db/queries.users.js");
const passport = require("passport");

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
    userQueries.createUser(newUser, (err, user) => {
      if (err) {
         req.flash("error", err)
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, function(){
          req.flash("notice", "You've successfully signed in!")
          res.redirect("/")
        })
      }
    });
  },
  signInForm(req, res, next){
    res.render("users/signin")
  },
  signIn(req, res, next){
    passport.authenticate("local")(req, res, function(){
      if(!req.user){
        req.flash("notice", "Sign in failed. Try again!")
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!")
        res.redirect("/")
      }
    })
  },
  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!")
    res.redirect("/")
  }
};
