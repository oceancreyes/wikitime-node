module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static");
    let userRoutes = require("../routes/users");
    app.use(staticRoutes);
    app.use(userRoutes);
  }
};
