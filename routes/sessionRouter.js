const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

router.use(express.json());

router.get("/login", controller.login_get);
router.post("/login", controller.login_post);

router.get("signup", controller.signup_get);
router.post("signup", controller.signup_post);

//TODO:
//signout - return page / sign out user
//reset-password - reset password
//forgot-password - return page

module.exports = router;