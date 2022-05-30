const express = require("express");
const router = express.Router();;
const controller = require("../controllers/mediaUploadController");



router.post("/", controller.post);
// router.use(express.json());
// router.use(formidable);


module.exports = router;