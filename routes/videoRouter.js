const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");
const uploadController = require("../controllers/mediaUploadController");
const { validateAdmin } = require("../middleware/validator");

// Delete a video or MP3
router.delete("/:id", validateAdmin, controller.delete);
// Upload a video in form format and save it on the server ->
router.post("/", uploadController.upload)
//Stream het bestand van een video
router.get("/stream/:id", controller.streamFile);

//Krijg het mp4-bestand van een video
router.get("/:id", controller.get)
router.get("/", controller.get)

router.get("/", controller.get)


module.exports = router;