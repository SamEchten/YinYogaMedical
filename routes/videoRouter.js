const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");

router.use(express.json());

//Stream het bestand van een video
router.get("/stream/:id", controller.streamFile);

//Krijg het mp4-bestand van een video
router.get("/:id", controller.get)
router.get("/", controller.get)


module.exports = router;