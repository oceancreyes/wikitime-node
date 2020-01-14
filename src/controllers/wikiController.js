let wikiQueries = require("../db/queries.wikis.js");
let Authorizer = require("../policies/appPolicies.js");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    let saved = req.user;
    wikiQueries.getAllWikis((err, wikis) => {
      if (err) {
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", { wikis });
      }
    });
  },
  show(req, res, next) {
    wikiQueries.getSpecificWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else if (wiki) {
        wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", { wiki });
      }
    });
  },
  new(req, res, next) {
    let authorized = new Authorizer(req.user)._new();
    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  edit(req, res, next) {
    wikiQueries.getSpecificWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        let authorized = new Authorizer(req.user, wiki).edit();
        if (authorized) {
          res.render("wikis/edit", { wiki });
        } else {
          req.flash("You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },
  create(req, res, next) {
  let authorized = new Authorizer(req.user).create();
       if (authorized) {
        var private;
        if(req.body.private_or_public == "true"){
          private = true
        } else{
          private = false;
        }
      const newWiki = {
        title: req.body.title,
        body: req.body.body,
        userId: req.user.id,
        private: private
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, "wiki/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },
  makePrivate(req, res, next){
    // let authorizedAdmin = new Authorizer(req.user).isAdmin()
    // let authorizedPremium = new Authorizer(req.user).isPremium()
    wikiQueries.makePrivate(req.params.id, (err, updatedWiki) => {
      if(err){
        req.flash("notice", "Something went wrong.");
        res.redirect("/wikis")
      } else{
        req.flash("notice", "Wiki is now private!");
        res.redirect("/wikis")
      }
    })
  }
};
