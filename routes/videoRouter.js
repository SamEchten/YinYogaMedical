const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");
const uploadController = require("../controllers/mediaUploadController");
const { validateAdmin, validateJwt, validateSubscription } = require("../middleware/validator");


//Get all videos
router.get("/", controller.get)

router.use(validateJwt);
//Stream het bestand van een video
router.get("/stream/:id", validateSubscription, controller.streamFile);
//Get info about one or all videos
router.get("/:id", validateSubscription, controller.get)

router.use(validateAdmin);
// Delete a video or MP3
router.delete("/:id", validateAdmin, controller.delete);
// Upload a video in form format and save it on the server ->
router.post("/", uploadController.upload)
// Update video or mp3
router.put("/:id", validateAdmin, controller.update)

module.exports = router;