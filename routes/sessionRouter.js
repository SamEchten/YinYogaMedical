const express = require("express");
const router = express.Router();

router.use(express.json());

//Login a user
router.post("/login", async (req, res) => {

});

//Logout a user
router.post("/logout", async (req, res) => {

});

//Sign up a user
router.post("/signup", async (req, res) => {

});

//Sends email to user with code to reset password
router.post("/forgot-password", async (req, res) => {

});

//Sets the password of a user
//Expects: id, authentication code
router.post("/set-password", async (req, res) => {

});

module.exports = router;