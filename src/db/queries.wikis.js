let Wiki = require("./models").Wiki;

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
      userId: newWiki.userId
    })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
  },
  updateWiki(req, updatedWiki, callback){
    return Wiki.findByPk(req.params.id).then(wiki => {
      if(!wiki){
        return callback("Wiki not found")
      }
      if(req.user){
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        }).then(() => {
          callback(null, wiki)
        })
        .catch(err => {
          callback(err)
        })
      } else{
        req.flash("notice", "You are not authorized to do that.")
        callback("Forbidden")
      }
    })
  },
  deleteWiki(req, callback){
    return Wiki.findByPk(req.params.id)
      .then(wiki => {
        if (req.user) {
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
  }
};
