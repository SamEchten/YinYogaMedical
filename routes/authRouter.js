const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");

router.post("/login", controller.login_post);
router.post("/signup", controller.signup_post);

//TODO:
//reset-password - reset password
//forgot-password - return page

module.exports = router;