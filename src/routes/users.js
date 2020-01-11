const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const helper = require("../auth/helpers.js");
const validation = require("./validation");

router.get("/users/sign_up", userController.signUp);
router.get("/users/sign_in", userController.signInForm);
router.get("/users/upgrade_account", helper.ensureAuthenticated, userController.upgradeForm)
router.get("/users/sign_out", userController.signOut);
router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.post("/users/:id/upgrade", helper.ensureAuthenticated, userController.upgrade)
router.post("/users/:id/downgrade", helper.ensureAuthenticated, userController.downgrade)

module.exports = router;
