const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
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
  upgradeAccount(id, callback){
    User.findByPk(id).then(user => {
      if(!user){
        return callback("User not found.")
      } else {
         user.update({role: 1})
         .then(() => {
          callback(null, user)
         })
      }
    }).catch(err => {
      console.log(err)
    })
  },
  downgradeAccount(id, callback){
    User.findByPk(id).then(user => {
      if(!user){
        return callback("User not found.")
      } else {
        user.update({role: 0}).then(() => {
          callback(null, user)
        })
      }
    }).catch(err => {
      console.log(err)
    })
  }
};
