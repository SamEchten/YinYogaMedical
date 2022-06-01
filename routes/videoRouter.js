const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");

router.use(express.json());

//Stream het bestand van een video
router.get("/stream/:id", controller.streamFile);

//krijg info over een, of alle videos
router.get("/:id", controller.get)
router.get("/", controller.get)

//verwijderen
router.delete("/:id", controller.delete);

//updaten
router.put("/:id", controller.update)


module.exports = router;