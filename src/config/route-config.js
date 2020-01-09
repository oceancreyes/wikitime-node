module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    let userRoutes = require("../routes/users");
    var wikiRoutes = require("../routes/wikis");
    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
  }
};
