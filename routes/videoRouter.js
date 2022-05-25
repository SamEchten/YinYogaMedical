const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");

router.use(express.json());

router.get("/", controller.get);


module.exports = router;