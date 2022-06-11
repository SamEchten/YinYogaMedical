const express = require("express");
const router = express.Router();
const controller = require("../controllers/podcastController");

//Get info about one or all videos
router.get("/:id", controller.get)
router.get("/", controller.get)

router.get("/stream/:id", controller.streamFile);

module.exports = router;