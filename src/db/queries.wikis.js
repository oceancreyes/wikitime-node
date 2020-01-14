let Wiki = require("./models").Wiki;
let Authorizer = require("../policies/appPolicies.js");

module.exports = {
  getAllWikis(callback) {
    return Wiki.findAll()
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(err => {
        callback(err);
      });
  },
  getSpecificWiki(id, callback) {
    return Wiki.findByPk(id)
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },
  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      userId: newWiki.userId,
      private: newWiki.private
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        console.log(err)
        callback(err);
      });
  },
  updateWiki(req, updatedWiki, callback) {
    return Wiki.findByPk(req.params.id).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }
      let authorized = new Authorizer(req.user, wiki).update();
      if (authorized) {
        wiki
          .update(updatedWiki, {
            fields: Object.keys(updatedWiki)
          })
          .then(() => {
            callback(null, wiki);
          })
          .catch(err => {
            callback(err);
          });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        callback("Forbidden");
      }
    });
  },
  deleteWiki(req, callback) {
    return Wiki.findByPk(req.params.id)
      .then(wiki => {
        var authorized = new Authorizer(req.user, wiki).destroy();
        if (authorized) {
          wiki.destroy().then(res => {
            callback(null, wiki);
          });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          callback(401);
        }
      })
      .catch(err => {
        callback(err);
      });
  },
  privateToPublic(user){
      return Wiki.findAll()
      .then(wikis => {
        wikis.forEach(wiki => {
          if (wiki.userId == user.id && wiki.private == true) {
            wiki.update({
              private: false
            });
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
   },
   makePrivate(id, callback){
    return Wiki.findByPk(id).then(wiki => {
      if(!wiki){
        return callback("Wiki not found")
      } else { 
        wiki.update({private: true}).then(updatedWiki => {
        callback(false, updatedWiki)
      })
    }
    }).catch(err => {
      console.log(err)
    })
   },
   getUserPrivateWikis(user, callback){
     return Wiki.findAll({where: {userId: user.id}}).then(wikis => {
   let privateWikis = wikis.filter(wiki => wiki.private == true)
      callback(null, privateWikis)
     })
     .catch(err => {
       callback(err)
     })
   }
};
