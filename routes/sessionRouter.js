const express = require("express");
const router = express.Router();
const controller = require("../controllers/sessionController");

//Get all sessions ->
router.get("/", controller.get);
//Get single session ->
router.get("/:id", controller.get);
//Get all session of user, userId is given ->
router.get("/byUser/:id", controller.getByUserId);
//Add new session ->
router.post("/", controller.add);
//Signs a user in for a session ->
router.post("/signup/:id", controller.signup);
//Signs a user out for a session ->
router.post("/signout/:id", controller.signout);
//Updates a session ->
router.put("/:id", controller.update);
//Deletes a session ->
router.delete("/:id", controller.delete);

module.exports = router;