const express = require("express");
const router = express.Router();
const path = require("path");
const { validateJwt } = require("../middleware/validator");
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const userController = require("../controllers/userController");

//Auth ->
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/logout", authController.logout);

//Session ->
router.get("/agenda", sessionController.view);

//profile ->
//TODO: add jwt validation
router.get("/profile/enrollments", userController.viewEnrollments);

// Home ->
router.get("/home", validateJwt, (req, res) => {
    res.render(path.join(__dirname, "../views/home"));
});

//Redirect non existing routes to home
router.get("/", (req, res) => res.redirect("/home"));
router.get("/*", (req, res) => res.redirect("/home"));

module.exports = router;