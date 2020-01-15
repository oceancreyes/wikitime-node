const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  signUp(req, res, next) {
    res.render("users/sign_up");
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
        req.flash("error", "Username and email already exists.");
        res.redirect("/users/sign_up");
      } else {
        passport.authenticate("local")(req, res, function() {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },
  signInForm(req, res, next) {
    res.render("users/sign_in");
  },
  signIn(req, res, next) {
    passport.authenticate("local")(req, res, function() {
      if (!req.user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign_in");
      } else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  upgradeForm(req, res, next) {
    let currentUser = req.user;
    if (req.user) {
      res.render("users/upgrade");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/");
    }
  },
  upgrade(req, res, next) {
    let payment = 1500;
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
      })
      .then(customer => {
        stripe.charges
          .create({
            amount: payment,
            description: "WikiTime Charge",
            currency: "usd",
            customer: customer.id
          })
          .then(charge => {
            userQueries.upgradeAccount(req.user.id, (err, newUser) => {
              if (newUser) {
                req.flash("notice", "Your account is now Premium!");
                res.redirect("/");
              } else {
                req.flash("notice", "Payment failed. Try again.");
                res.redirect("/users/upgrade");
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
  },
  downgrade(req, res, next) {
    userQueries.downgradeAccount(req.user.id, (err, success) => {
      if (success) {
        req.flash("notice", "Your account has been downgraded from Premium!");
        res.redirect("/");
      } else {
        req.flash("notice", "Error...couldn't downgrade at this time!");
        res.redirect("/users/upgrade");
      }
    });
  },
  showCollaborators(req, res, next) {
    userQueries.getUser(req.user.id, (err, result) => {
      user = result["user"];
      collaborator = result["collaborator"];
      if (err || user == null) {
        res.redirect(404, "/");
      } else {
        res.render("users/collaborators", { collaborator });
      }
    });
  }
};
