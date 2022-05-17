const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");

//Auth ->
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/logout", authController.logout);
//Session ->
router.get("/agenda", sessionController.view);

// Home ->


module.exports = router;