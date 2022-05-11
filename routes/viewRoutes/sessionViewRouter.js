const express = require("express");
const router = express.Router();
const controller = require("../../controllers/sessionController");

router.get("/login", controller.login_get);
router.get("/signup", controller.signup_get);

module.exports = router;