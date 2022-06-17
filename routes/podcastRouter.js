const express = require("express");
const router = express.Router();
const controller = require("../controllers/podcastController");
const { validateAdmin, validateJwt, validateSubscription } = require("../middleware/validator");

//Get info about one or all videos
router.get("/:id", controller.get)
router.get("/", controller.get)

router.get("/stream/:fileName/:userId", controller.streamFile);
router.delete("/:id", validateAdmin, controller.delete);
router.put("/:id", validateAdmin, controller.update)

module.exports = router;