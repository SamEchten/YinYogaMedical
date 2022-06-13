const express = require("express");
const router = express.Router();
const controller = require("../controllers/dashboardController");

//Logges a user in if correct email and password were given
router.get("/productStats", controller.productStats);
router.get("/sessionStats", controller.sessionStats);

module.exports = router;