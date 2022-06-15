const express = require("express");
const router = express.Router();
const path = require("path");
const { validateJwt, validateAdmin, validateSubscription } = require("../middleware/validator");
const authController = require("../controllers/authController");
const sessionController = require("../controllers/sessionController");
const userController = require("../controllers/userController");
const profileController = require("../controllers/profileController");
const productController = require("../controllers/productController");
const videoController = require("../controllers/videoController");
const podcastController = require("../controllers/podcastController");
const dashboardController = require("../controllers/dashboardController");

//Auth ->
router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/logout", authController.logout);

//Session ->
router.get("/agenda", sessionController.view);

//Products ->
//TODO: add jwt validation
router.get("/producten", productController.view);
router.get("/producten/succes/:id", productController.succes);

//Videos ->
router.get("/videos", videoController.view);
router.get("/videos/:id", videoController.videoDisplay);

//Podcats ->
router.get("/podcasts", podcastController.view);
/*router.get("/podcasts/:id", podcastController.podcastDisplay);*/


//profile ->
//TODO: add jwt validation
router.get("/profile/", profileController.viewProfile);
router.get("/profile/myProfile", profileController.viewMyProfile);
router.get("/profile/myPoducts", profileController.viewMyProducts);
router.get("/profile/myPayments", profileController.viewMyPayments);
router.get("/profile/mySubscription", profileController.viewMySubscriptions);
router.get("/profile/settings", profileController.viewSettings);

//Dashboard
router.get("/dashboard", dashboardController.viewDashboard);
router.get("/dashboard/klanten", dashboardController.viewUsers);
router.get("/dashboard/klanten/:id", dashboardController.viewUserDetails);
router.get("/dashboard/producten", dashboardController.viewProducts);
router.get("/dashboard/sessies", dashboardController.viewSessions);
router.get("/dashboard/toSchedule", dashboardController.viewToSchedule);

// Succes payment view 
router.get("/payment", validateJwt, (req, res) => {
    res.render(path.join(__dirname, "../views/paymentSucces"));
});

// Home ->
router.get("/home", validateJwt, (req, res) => {
    res.render(path.join(__dirname, "../views/home"));
});

//Redirect non existing routes to home
router.get("/", (req, res) => res.redirect("/home"));
router.get("/*", (req, res) => res.redirect("/home"));

module.exports = router;