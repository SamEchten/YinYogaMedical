const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const userController = require("../controllers/userController");

//Auth ->
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/logout", authController.logout);
//Session ->
router.get("/agenda", sessionController.view);

// Home ->

//profile ->

router.get("/profile", userController.view);


module.exports = router;