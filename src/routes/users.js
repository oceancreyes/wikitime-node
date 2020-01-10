let express = require("express");
let router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");
const helper = require("../auth/helpers.js");

router.get("/users/sign_up", userController.signUp);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/upgrade", helper.ensureAuthenticated, userController.upgradeForm)

router.get("/users/sign_out", userController.signOut);
router.post("/users/:id/upgrade", helper.ensureAuthenticated, userController.upgrade)
router.post("/users/:id/downgrade", helper.ensureAuthenticated, userController.downgrade)

module.exports = router;
