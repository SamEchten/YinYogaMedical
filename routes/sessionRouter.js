const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.use(express.json());


module.exports = router;