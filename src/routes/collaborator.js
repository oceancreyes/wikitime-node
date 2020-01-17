const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");
const userController = require("../controllers/userController");

router.get("/users/collaborators", userController.showCollaborators);
router.post("/wikis/:wikiId/collaborators/add", collaboratorController.add);
router.get("/wikis/:wikiId/collaborators", collaboratorController.edit);
router.post(
  "/wikis/:wikiId/collaborators/remove",
  collaboratorController.remove
);


module.exports = router;
