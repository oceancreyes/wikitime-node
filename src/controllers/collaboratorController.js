const express = require("express");
const router = express.Router();
const wikiQueries = require("../db/queries.wikis.js");
const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
  add(req, res, next) {
    collaboratorQueries.add(req, (err, collaborator) => {
      if (err) {
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  },
  edit(req, res, next) {
    wikiQueries.getSpecificWiki(req.user, req.params.wikiId, (err, result) => {
      if(result){
      var wiki = result["wiki"];
      var collaborators = result["collaborators"];
      }
      if (err && wiki == null || result == null) {
        res.redirect(404, "/");
      } else if(req.user.Id == wiki.userId){
        //const authorized = new Authorizer(req.user, wiki, collaborators).edit();
          res.render("collaborators/edit", { wiki, collaborators });
      }
          else {
          req.flash("You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.wikiId}`);
        }
      });
  },

  remove(req, res, next) {
    if (req.user) {
      collaboratorQueries.remove(req, (err, collaborator) => {
        if (err) {
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
    } else {
      req.flash("notice", "You must be signed in to remove Collaborators!");
      res.redirect(req.headers.referer);
    }
  }
};
