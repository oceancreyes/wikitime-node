module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    var userRoutes = require("../routes/users");
    var wikiRoutes = require("../routes/wikis");
    const collabRoutes = require("../routes/collaborator");

    if (process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }
    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(collabRoutes);
    app.use(wikiRoutes);
  }
};
