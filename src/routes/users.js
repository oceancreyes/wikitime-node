const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const helper = require("../auth/helpers.js");
const validation = require("./validation");
const User = require("../../src/db/models").User;

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get(
  "/users/upgrade",
  helper.ensureAuthenticated,
  userController.upgradeForm
);
router.get("/users/sign_out", userController.signOut);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.post(
  "/users/upgrade",
  helper.ensureAuthenticated,
  userController.upgrade
);
router.post(
  "/users/downgrade",
  helper.ensureAuthenticated,
  userController.downgrade
);

module.exports = router;
