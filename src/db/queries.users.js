const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
const wikiQueries = require("./queries.wikis.js");
const Collaborator = require("./models").Collaborator;

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);
    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
      .then(user => {
        // const msg = {
        //   to: newUser.email,
        //   from: "welcome@wikitime.com",
        //   subject: "Welcome to WikiTime",
        //   html: "<strong>Welcome to WikiTime! Start posting about what's important to you!</strong>"
        // };
        // sgMail.send(msg);
        callback(null, user);
      })
      .catch(err => {
        callback(err);
      });
  },
  upgradeAccount(id, callback) {
    User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User not found.");
        } else {
          user.update({ role: 1 }).then(newUser => {
            callback(null, newUser);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  downgradeAccount(id, callback) {
    User.findByPk(id)
      .then(user => {
        if (!user) {
          return callback("User not found.");
        } else {
          user.update({ role: 0 }).then(newUser => {
            wikiQueries.privateToPublic(newUser);
            callback(null, newUser);
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  getUser(id, callback) {
    let result = {};
    User.findByPk(id)
   .then((user) => {
     if(!user) {
       //console.log("user not found")
       callback(404);
     } else {
       //console.log("user is valid");
       result["user"] = user;
       Collaborator.scope({method: ["collaborator", id]}).findAll()
       .then((collaborator) => {
         result["collaborator"] = collaborator;
         callback(null, result);
       })
       .catch((err) => {
         callback(err);
       })
     }
   })
  }
};
