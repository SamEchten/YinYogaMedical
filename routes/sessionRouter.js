const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.use(express.json());

router.post("/login", controller.login_post);
router.post("/signup", controller.signup_post);
router.get("/logout", controller.logout);

//TODO:
//reset-password - reset password
//forgot-password - return page

module.exports = router;