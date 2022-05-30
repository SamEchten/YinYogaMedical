const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

//Logges a user in if correct email and password were given
router.post("/login", controller.login_post);
//Signs up a user
router.post("/signup", controller.signup_post);

//TODO:
//reset-password - reset password
//forgot-password - return page

module.exports = router;