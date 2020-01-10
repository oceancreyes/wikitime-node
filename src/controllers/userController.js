const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//let publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
let Authorizer = require("../policies/appPolicies.js");


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
        req.flash("error", err);
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
    let authorized = new Authorizer(req.user).show();
if(authorized){
  res.render("users/signin");

}  else {
  req.flash("notice", "You are not authorized to do that.");
  res.redirect("/");
}
  },
  signIn(req, res, next) {
    passport.authenticate("local")(
      //activates passport first then kind of loops back to the signIn(req, res, next) function again
      req,
      res,
      function() {
        if (req.user) {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        } else {
          req.flash("notice", "Sign in failed. Please try again.");
          res.redirect("/users/sign_in");
        }
      }
    );
  },
  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
  upgradeForm(req, res, next) {
    res.render("users/upgrade");
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
            userQueries.upgradeAccount(req.user.id, (err, user) => {
              if(user){
                req.flash("notice", "Your account is now Premium!");
                res.redirect("/");
              } else {
              req.flash("notice", "Payment failed. Try again.");
              res.redirect("/users/upgrade");
            }
            })
          })
          .catch(err => {
            console.log(err)
          });
      });

  },
  downgrade(req, res, next){
    userQueries.downgradeAccount(req.user.id, (err, success) => {
      if(success){
        req.flash("notice", "Your account has been downgraded from Premium!")
        res.redirect("/");
      } else{
        req.flash("notice", "Error...couldn't downgrade at this time!")
        res.redirect("/users/upgrade");
      }
    })
  }
};
