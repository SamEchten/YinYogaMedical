const express = require("express");
const router = express.Router();
const path = require("path");
const { validateJwt } = require("../middleware/validator");
const { validateAdmin } = require("../middleware/validator");
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const productController = require("../controllers/productController");
const videoController = require("../controllers/videoController");

//Auth ->
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/logout", authController.logout);

//Session ->
router.get("/agenda", sessionController.view);

//Products ->
//TODO: add jwt validation
router.get("/producten", productController.view);

//Videos ->
router.get("/videos/", videoController.view);
router.get("/videos/:id", videoController.videoDisplay);
//profile ->
//TODO: add jwt validation
router.get("/profile/", profileController.viewProfile);
router.get("/profile/myProfile", profileController.viewMyProfile);
router.get("/profile/myPoducts", profileController.viewMyProducts);
router.get("/profile/myEnrollments", profileController.viewMyEnrollments);


// Home ->
router.get("/home", validateJwt, (req, res) => {
    res.render(path.join(__dirname, "../views/home"));
});

//Redirect non existing routes to home
router.get("/", (req, res) => res.redirect("/home"));
router.get("/*", (req, res) => res.redirect("/home"));

module.exports = router;